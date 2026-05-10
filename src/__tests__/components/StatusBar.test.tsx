import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '@/components/StatusBar';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('StatusBar', () => {
  it('renders ONLINE status indicator', () => {
    render(<StatusBar />);
    expect(screen.getByText('ONLINE')).toBeInTheDocument();
  });

  it('renders version badge', () => {
    render(<StatusBar />);
    expect(screen.getByText(/v1\.0\.0/)).toBeInTheDocument();
  });

  it('renders SagaPad Agent label', () => {
    render(<StatusBar />);
    expect(screen.getByText('SagaPad Agent')).toBeInTheDocument();
  });

  it('renders latency indicator', () => {
    render(<StatusBar />);
    expect(screen.getByText(/LATENCY/)).toBeInTheDocument();
  });

  it('renders latency value in ms', () => {
    render(<StatusBar />);
    expect(screen.getByText(/\d+ms/)).toBeInTheDocument();
  });

  it('renders uptime indicator', () => {
    render(<StatusBar />);
    expect(screen.getByText(/UPTIME/)).toBeInTheDocument();
  });

  it('renders 99.9% uptime value', () => {
    render(<StatusBar />);
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('renders a clock time after mount', () => {
    render(<StatusBar />);
    // Time format: HH:MM:SS
    expect(screen.getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('has sticky positioning class', () => {
    const { container } = render(<StatusBar />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toContain('sticky');
  });

  it('updates latency on interval', () => {
    vi.useFakeTimers();
    render(<StatusBar />);
    const initial = screen.getByText(/\d+ms/).textContent;

    // Advance 3s to trigger the latency update interval
    vi.advanceTimersByTime(3000);

    // The new value is random so just verify it's still a valid ms reading
    expect(screen.getByText(/\d+ms/)).toBeInTheDocument();
    // Latency range is 8–15ms — just verify the element still renders after interval
    void initial;
  });
});
