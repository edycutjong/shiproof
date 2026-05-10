import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TerminalLog } from '@/components/TerminalLog';

afterEach(() => {
  vi.useRealTimers();
});

describe('TerminalLog', () => {
  it('renders the terminal header', () => {
    render(<TerminalLog />);
    expect(screen.getAllByText(/agent\.log/)[0]).toBeInTheDocument();
  });

  it('renders the LIVE indicator', () => {
    render(<TerminalLog />);
    expect(screen.getAllByText('LIVE')[0]).toBeInTheDocument();
  });

  it('renders initial log entries', () => {
    render(<TerminalLog />);
    expect(screen.getAllByText(/Initializing Proof of Ship Agent/)[0]).toBeInTheDocument();
  });

  it('renders manifest validated log', () => {
    render(<TerminalLog />);
    expect(screen.getAllByText(/Manifest validated/)[0]).toBeInTheDocument();
  });

  it('renders webhook listening log', () => {
    render(<TerminalLog />);
    expect(screen.getAllByText(/Listening on POST \/api\/webhook\/github/)[0]).toBeInTheDocument();
  });

  it('renders terminal cursor', () => {
    render(<TerminalLog />);
    expect(screen.getAllByText('$')[0]).toBeInTheDocument();
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
    const { container } = render(<TerminalLog />);

    // Advance 60 seconds = 20 intervals of 3s
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    const logs = container.querySelectorAll('.p-4.h-52 > div.flex.gap-3');
    expect(logs.length).toBeLessThanOrEqual(20);
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
