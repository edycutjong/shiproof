// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

import { GET } from '@/app/api/skill/manifest/route';

describe('GET /api/skill/manifest', () => {
  it('responds with HTTP 200', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it('returns skill name and displayName', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.name).toBe('shiproof');
    expect(data.displayName).toBeTruthy();
  });

  it('returns version 1.0.0', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.version).toBe('1.0.0');
  });

  it('has type "action"', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.type).toBe('action');
  });

  it('has webhook trigger pointing to correct endpoint', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.trigger.type).toBe('webhook');
    expect(data.trigger.event).toBe('github.push');
    expect(data.trigger.endpoint).toBe('/api/webhook/github');
  });

  it('lists 3 capabilities', async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data.capabilities)).toBe(true);
    expect(data.capabilities).toHaveLength(3);
  });

  it('includes commit_summarize capability', async () => {
    const res = await GET();
    const data = await res.json();
    const cap = data.capabilities.find((c: { name: string }) => c.name === 'commit_summarize');
    expect(cap).toBeDefined();
    expect(cap.model).toBe('gpt-4o-mini');
  });

  it('has authentication config', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.authentication.github).toBe('webhook_secret');
    expect(data.authentication.x_api).toBe('oauth2_pkce');
    expect(data.authentication.sagapad).toBe('api_key');
  });

  it('has config with default hashtags', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.config.maxTweetLength).toBe(280);
    expect(data.config.includeHashtags).toBe(true);
    expect(data.config.defaultHashtags).toContain('#ProofOfShip');
  });

  it('has marketplace info', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.marketplace.published).toBe(true);
    expect(data.marketplace.url).toBeTruthy();
  });
});
