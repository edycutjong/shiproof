// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SagaPadService } from '@/lib/sagapad';

describe('SagaPadService', () => {
  let service: SagaPadService;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    service = new SagaPadService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('init', () => {
    it('initializes only once (idempotent)', () => {
      vi.stubEnv('SAGAPAD_API_KEY', 'test-key');
      service.init();
      service.init();
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('warns when SAGAPAD_API_KEY is missing', () => {
      vi.stubEnv('SAGAPAD_API_KEY', '');
      service.init();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('No API key')
      );
    });

    it('does not warn when SAGAPAD_API_KEY is set', () => {
      vi.stubEnv('SAGAPAD_API_KEY', 'sk-test-key');
      service.init();
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('generateDraft', () => {
    it('returns draft from API on success', async () => {
      const mockDraft = 'Just shipped an amazing feature! 🚢 #ProofOfShip';
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ draft: mockDraft }),
      }));

      const result = await service.generateDraft('feat: add new feature');
      expect(result).toBe(mockDraft);
    });

    it('sends correct payload to API', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ draft: 'test' }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await service.generateDraft('fix: resolve bug');

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(options.body as string);
      expect(body.task).toBe('tweet_draft');
      expect(body.context).toBe('fix: resolve bug');
      expect(body.tone).toBe('excited_builder');
    });

    it('falls back to template when API throws', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const promise = service.generateDraft('feat: lazy minting');
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toContain('feat: lazy minting');
      expect(result).toContain('#ProofOfShip');
      expect(result).toContain('#SagaPad');
    });

    it('falls back to template when API responds not-ok', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

      const promise = service.generateDraft('chore: update deps');
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toContain('chore: update deps');
      expect(result).toContain('#ProofOfShip');
    });
  });

  describe('validateManifest', () => {
    it('returns true when API responds ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
      const result = await service.validateManifest();
      expect(result).toBe(true);
    });

    it('returns false when API responds not-ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
      const result = await service.validateManifest();
      expect(result).toBe(false);
    });

    it('returns true as fallback when fetch throws', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
      const result = await service.validateManifest();
      expect(result).toBe(true);
    });
  });
});
