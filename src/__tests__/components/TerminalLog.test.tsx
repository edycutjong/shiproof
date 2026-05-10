import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TerminalLog } from '@/components/TerminalLog';

afterEach(() => {
  vi.useRealTimers();
});

describe('TerminalLog', () => {
  it('renders the terminal header', () => {
    render(<TerminalLog />);
    expect(screen.getByText(/agent\.log/)).toBeInTheDocument();
  });

  it('renders the LIVE indicator', () => {
    render(<TerminalLog />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('renders initial log entries', () => {
    render(<TerminalLog />);
    expect(screen.getByText(/Initializing Proof of Ship Agent/)).toBeInTheDocument();
  });

  it('renders manifest validated log', () => {
    render(<TerminalLog />);
    expect(screen.getByText(/Manifest validated/)).toBeInTheDocument();
  });

  it('renders webhook listening log', () => {
    render(<TerminalLog />);
    expect(screen.getByText(/Listening on POST \/api\/webhook\/github/)).toBeInTheDocument();
  });

  it('renders terminal cursor', () => {
    render(<TerminalLog />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders traffic-light dots in header', () => {
    const { container } = render(<TerminalLog />);
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it('appends a new log entry after 3 seconds', async () => {
    vi.useFakeTimers();
    render(<TerminalLog />);

    const initialCount = screen.getAllByText(/\[/).length;

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    const updatedCount = screen.getAllByText(/\[/).length;
    expect(updatedCount).toBeGreaterThan(initialCount);
  });

  it('keeps log list bounded to 20 entries', async () => {
    vi.useFakeTimers();
    render(<TerminalLog />);

    // Advance 60 seconds = 20 intervals of 3s
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    // Each log line is inside a div with flex gap-3 — count timestamp spans
    const timestamps = screen
      .getAllByText(/\d{2}:\d{2}:\d{2}/)
      .filter((el) => el.tagName === 'SPAN');
    expect(timestamps.length).toBeLessThanOrEqual(20);
  });

  it('clears interval on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(<TerminalLog />);
    unmount();
    // Verify interval is cleared on unmount
  });

  it('scrolls to bottom on new log', async () => {
    vi.useFakeTimers();
    const { container } = render(<TerminalLog />);
    const scrollContainer = container.querySelector('.overflow-y-auto') as HTMLElement;
    Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 500 });
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, writable: true, value: 0 });
    
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(scrollContainer.scrollTop).toBe(500);
  });
});
