// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

vi.mock('@/lib/sagapad', () => ({
  sagaPadService: {
    generateDraft: vi.fn().mockResolvedValue('Just shipped something awesome! #ProofOfShip'),
  },
}));

import { POST, GET } from '@/app/api/webhook/github/route';
import { sagaPadService } from '@/lib/sagapad';

const makeRequest = (payload: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/webhook/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });

const samplePayload = {
  repository: { full_name: 'user/test-repo' },
  commits: [
    {
      id: 'abc123def456',
      message: 'feat: add lazy minting',
      author: { name: 'Alice' },
      added: ['src/mint.ts'],
      modified: ['src/config.ts'],
      removed: [],
    },
  ],
};

describe('GET /api/webhook/github', () => {
  it('returns listening status', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.status).toBe('listening');
  });

  it('returns correct endpoint path', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.endpoint).toBe('/api/webhook/github');
  });

  it('lists push event', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.events).toContain('push');
  });

  it('identifies the agent', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.agent).toBe('shiproof-sagapad-skill');
  });
});

describe('POST /api/webhook/github', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('responds with success for valid payload', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.status).toBe('success');
  });

  it('extracts repo name from payload', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.data.repo).toBe('user/test-repo');
  });

  it('extracts 7-char commit hash', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.data.hash).toBe('abc123d');
  });

  it('extracts commit message', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.data.commitMsg).toBe('feat: add lazy minting');
  });

  it('extracts author name', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.data.author).toBe('Alice');
  });

  it('counts total files changed', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.data.filesChanged).toBe(2); // added + modified
  });

  it('includes tweet draft from sagapad service', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(data.data.tweetDraft).toBe('Just shipped something awesome! #ProofOfShip');
  });

  it('calls sagapad generateDraft with the commit message', async () => {
    await POST(makeRequest(samplePayload));
    expect(sagaPadService.generateDraft).toHaveBeenCalledWith('feat: add lazy minting');
  });

  it('includes ISO timestamp in response', async () => {
    const res = await POST(makeRequest(samplePayload));
    const data = await res.json();
    expect(() => new Date(data.data.timestamp)).not.toThrow();
  });

  it('uses defaults for empty payload', async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();
    expect(data.status).toBe('success');
    expect(data.data.repo).toBe('unknown/repo');
    expect(data.data.author).toBe('Unknown');
    expect(data.data.commitMsg).toBe('No message');
    expect(data.data.filesChanged).toBe(0);
  });

  it('returns 500 on JSON parse error', async () => {
    const req = new Request('http://localhost/api/webhook/github', {
      method: 'POST',
      body: 'not valid json }{',
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.status).toBe('error');
  });

  describe('HMAC signature verification', () => {
    async function makeSignedRequest(secret: string, payload: unknown) {
      const body = JSON.stringify(payload);
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
      const hex = Array.from(new Uint8Array(mac))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const signature = `sha256=${hex}`;

      return new Request('http://localhost/api/webhook/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hub-signature-256': signature,
        },
        body,
      });
    }

    it('accepts request with valid HMAC signature', async () => {
      vi.stubEnv('GITHUB_WEBHOOK_SECRET', 'my-secret');
      const req = await makeSignedRequest('my-secret', samplePayload);
      const res = await POST(req);
      const data = await res.json();
      expect(data.status).toBe('success');
    });

    it('rejects request with wrong signature', async () => {
      vi.stubEnv('GITHUB_WEBHOOK_SECRET', 'my-secret');
      const req = await makeSignedRequest('wrong-secret', samplePayload);
      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.status).toBe('error');
      expect(data.message).toContain('Invalid signature');
    });

    it('rejects request with missing signature header when secret is set', async () => {
      vi.stubEnv('GITHUB_WEBHOOK_SECRET', 'my-secret');
      const req = makeRequest(samplePayload); // no signature header
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('rejects request with signature of different length', async () => {
      vi.stubEnv('GITHUB_WEBHOOK_SECRET', 'my-secret');
      const req = new Request('http://localhost/api/webhook/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hub-signature-256': 'sha256=1234',
        },
        body: JSON.stringify(samplePayload),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('allows request without secret configured (demo mode)', async () => {
      vi.stubEnv('GITHUB_WEBHOOK_SECRET', '');
      const req = makeRequest(samplePayload);
      const res = await POST(req);
      const data = await res.json();
      expect(data.status).toBe('success');
    });
  });
});
