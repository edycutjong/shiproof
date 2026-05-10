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

import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.status).toBe('ok');
  });

  it('includes a valid ISO timestamp', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it('includes uptime as a non-negative number', async () => {
    const res = await GET();
    const data = await res.json();
    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThanOrEqual(0);
  });

  it('includes environment field', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.environment).toBeDefined();
  });

  it('responds with HTTP 200', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });
});
