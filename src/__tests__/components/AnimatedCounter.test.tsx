import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AnimatedCounter } from '@/components/AnimatedCounter';

describe('AnimatedCounter', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial count of 0', () => {
    render(<AnimatedCounter target={100} />);
    expect(screen.getAllByText('0')[0]).toBeInTheDocument();
  });

  it('renders with suffix appended to count', () => {
    render(<AnimatedCounter target={50} suffix="%" />);
    expect(screen.getAllByText('0%')[0]).toBeInTheDocument();
  });

  it('applies className to the span', () => {
    const { container } = render(<AnimatedCounter target={100} className="my-class" />);
    expect(container.querySelector('.my-class')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    const { container } = render(<AnimatedCounter target={42} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('calls requestAnimationFrame on mount', () => {
    render(<AnimatedCounter target={200} />);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('calls cancelAnimationFrame on unmount', () => {
    const { unmount } = render(<AnimatedCounter target={100} />);
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('renders suffix even for target of 0', () => {
    render(<AnimatedCounter target={0} suffix="px" />);
    expect(screen.getAllByText('0px')[0]).toBeInTheDocument();
  });

  it('animates to target when rAF fires twice', async () => {
    let capturedCb: FrameRequestCallback | undefined;
    vi.mocked(window.requestAnimationFrame).mockImplementation((cb) => {
      capturedCb = cb;
      return 1;
    });

    render(<AnimatedCounter target={100} duration={100} />);

    // Simulate two frames: first establishes startRef, second completes animation
    await act(async () => {
      capturedCb!(0);   // startRef.current = 0, elapsed = 0, progress = 0
      capturedCb!(200); // elapsed = 200 > duration=100, progress clamped to 1, count = 100
    });

    expect(screen.getAllByText('100')[0]).toBeInTheDocument();
  });
});
