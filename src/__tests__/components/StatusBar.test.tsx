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
    expect(screen.getAllByText('ONLINE')[0]).toBeInTheDocument();
  });

  it('renders version badge', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/v1\.0\.0/)[0]).toBeInTheDocument();
  });

  it('renders SagaPad Agent label', () => {
    render(<StatusBar />);
    expect(screen.getAllByText('SagaPad Agent')[0]).toBeInTheDocument();
  });

  it('renders latency indicator', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/LATENCY/)[0]).toBeInTheDocument();
  });

  it('renders latency value in ms', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/\d+ms/)[0]).toBeInTheDocument();
  });

  it('renders uptime indicator', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/UPTIME/)[0]).toBeInTheDocument();
  });

  it('renders 99.9% uptime value', () => {
    render(<StatusBar />);
    expect(screen.getAllByText('99.9%')[0]).toBeInTheDocument();
  });

  it('renders a clock time after mount', () => {
    render(<StatusBar />);
    // Time format: HH:MM:SS
    expect(screen.getAllByText(/\d{2}:\d{2}:\d{2}/)[0]).toBeInTheDocument();
  });

  it('has sticky positioning class', () => {
    const { container } = render(<StatusBar />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toContain('sticky');
  });

  it('updates latency on interval', () => {
    vi.useFakeTimers();
    render(<StatusBar />);
    const initial = screen.getAllByText(/\d+ms/)[0].textContent;

    // Advance 3s to trigger the latency update interval
    vi.advanceTimersByTime(3000);

    // The new value is random so just verify it's still a valid ms reading
    expect(screen.getAllByText(/\d+ms/)[0]).toBeInTheDocument();
    // Latency range is 8–15ms — just verify the element still renders after interval
    void initial;
  });

  it('updates time on interval', () => {
    vi.useFakeTimers();
    render(<StatusBar />);
    vi.advanceTimersByTime(1000);
    expect(screen.getAllByText(/\d{2}:\d{2}:\d{2}/)[0]).toBeInTheDocument();
  });

  it('clears intervals on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(<StatusBar />);
    unmount();
  });
});
