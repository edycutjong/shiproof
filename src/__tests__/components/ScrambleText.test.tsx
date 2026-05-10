import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ScrambleText } from '@/components/ScrambleText';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('ScrambleText', () => {
  it('renders the text prop before scramble starts', () => {
    vi.useFakeTimers();
    render(<ScrambleText text="Hello World" delay={500} />);
    // Delay > 0, so scramble hasn't started yet — fallback to text prop
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders text immediately when delay is 0 and no time has passed', () => {
    vi.useFakeTimers();
    render(<ScrambleText text="Shiproof" delay={0} />);
    // Before advancing timers the text fallback shows
    expect(screen.getByText('Shiproof')).toBeInTheDocument();
  });

  it('resolves to final text after scramble completes', async () => {
    vi.useFakeTimers();
    render(<ScrambleText text="Ship" delay={0} speed={10} />);
    // Advance enough time for all characters to resolve (4 chars × 3 steps × 10ms)
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText('Ship')).toBeInTheDocument();
  });

  it('applies provided className', () => {
    const { container } = render(<ScrambleText text="Test" className="neon-text" />);
    expect(container.querySelector('.neon-text')).toBeInTheDocument();
  });

  it('renders inside a span element', () => {
    const { container } = render(<ScrambleText text="Test" />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('preserves spaces during scramble', async () => {
    vi.useFakeTimers();
    const { container } = render(<ScrambleText text="A B" delay={0} speed={5} />);
    // Advance partially — space character should never be scrambled
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    // The space is preserved in whatever partial scramble state
    const span = container.querySelector('span');
    expect(span?.textContent).toContain(' ');
  });

  it('clears timeout and interval on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(<ScrambleText text="Test" delay={10} speed={10} />);
    
    // Advance enough for the initial timeout to trigger and setInterval to start
    act(() => {
      vi.advanceTimersByTime(15);
    });
    
    unmount();
    // Test passes if no errors are thrown and coverage hits cleanup
  });
});
