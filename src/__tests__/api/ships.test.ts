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

import { GET } from '@/app/api/ships/route';

interface Ship {
  id: string;
  repo: string;
  commitMsg: string;
  hash: string;
  tweetDraft: string;
  postedAt: string;
  engagement: { likes: number; retweets: number; replies: number };
}

describe('GET /api/ships', () => {
  it('responds with HTTP 200', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it('returns a ships array', async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data.ships)).toBe(true);
  });

  it('returns exactly 3 ships', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.ships).toHaveLength(3);
  });

  it('total matches ships array length', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.total).toBe(data.ships.length);
  });

  it('each ship has required fields', async () => {
    const res = await GET();
    const { ships } = await res.json();
    ships.forEach((ship: Ship) => {
      expect(ship.id).toBeTruthy();
      expect(ship.repo).toBeTruthy();
      expect(ship.commitMsg).toBeTruthy();
      expect(ship.hash).toHaveLength(7);
      expect(ship.tweetDraft).toBeTruthy();
      expect(ship.postedAt).toBeTruthy();
    });
  });

  it('each ship has engagement metrics', async () => {
    const res = await GET();
    const { ships } = await res.json();
    ships.forEach((ship: Ship) => {
      expect(typeof ship.engagement.likes).toBe('number');
      expect(typeof ship.engagement.retweets).toBe('number');
      expect(typeof ship.engagement.replies).toBe('number');
    });
  });

  it('postedAt values are valid ISO dates', async () => {
    const res = await GET();
    const { ships } = await res.json();
    ships.forEach((ship: Ship) => {
      expect(() => new Date(ship.postedAt)).not.toThrow();
      expect(new Date(ship.postedAt).getTime()).not.toBeNaN();
    });
  });
});
