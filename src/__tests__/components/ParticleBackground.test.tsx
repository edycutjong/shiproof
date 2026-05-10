import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ParticleBackground } from '@/components/ParticleBackground';

describe('ParticleBackground', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock canvas
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 16) as unknown as number);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearTimeout);
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('renders and mounts correctly', () => {
    const { unmount } = render(<ParticleBackground />);
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('handles window resize', () => {
    render(<ParticleBackground />);
    const resizeListener = (window.addEventListener as import("vitest").Mock).mock.calls.find(
      (call: unknown[]) => call[0] === 'resize'
    )![1];
    
    act(() => {
      window.innerWidth = 1024;
      window.innerHeight = 768;
      resizeListener();
    });
    
    expect(window.innerWidth).toBe(1024);
  });
});
