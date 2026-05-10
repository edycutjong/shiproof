import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ShiproofDashboard from '@/app/dashboard/page';
import { sagaPadService } from '@/lib/sagapad';

vi.mock('@/lib/sagapad', () => ({
  sagaPadService: {
    generateDraft: vi.fn().mockResolvedValue('Mocked draft tweet for proof of ship.'),
  },
}));

vi.mock('@/components/ParticleBackground', () => ({
  ParticleBackground: () => <div data-testid="particle-bg" />
}));

vi.mock('@/components/ScrambleText', () => ({
  ScrambleText: ({ text }: { text: string }) => <span data-testid="scramble-text">{text}</span>
}));

vi.mock('@/components/AnimatedCounter', () => ({
  AnimatedCounter: ({ target }: { target: number }) => <span data-testid="animated-counter">{target}</span>
}));

vi.mock('@/components/TerminalLog', () => ({
  TerminalLog: () => <div data-testid="terminal-log" />
}));

vi.mock('@/components/FlowDiagram', () => ({
  FlowDiagram: () => <div data-testid="flow-diagram" />
}));

vi.mock('@/components/StatusBar', () => ({
  StatusBar: () => <div data-testid="status-bar" />
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer" />
}));

describe('ShiproofDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<ShiproofDashboard />);
    
    expect(screen.getByTestId('particle-bg')).toBeDefined();
    expect(screen.getByTestId('scramble-text')).toBeDefined();
    expect(screen.getAllByRole('button', { name: /Simulate Git Push/i })[0]).toBeDefined();
    
    // Initial logs are present (2 of them)
    expect(screen.getByText('user/shiproof-core')).toBeDefined();
    expect(screen.getByText('user/defi-agent')).toBeDefined();
    expect(screen.getAllByText('DRAFT READY').length).toBe(2);
  });

  it('simulates git push and cycles through log states', async () => {
    render(<ShiproofDashboard />);
    
    const simulateButton = screen.getAllByRole('button', { name: /Simulate Git Push/i })[0];
    
    // Trigger simulation
    await act(async () => {
      fireEvent.click(simulateButton);
    });
    
    // A new log should appear with "WEBHOOK RECEIVED"
    expect(screen.getByText('WEBHOOK RECEIVED')).toBeDefined();
    expect(screen.getByText('user/frontier-hack')).toBeDefined();

    // Advance timers by 800ms for "summarizing" state
    await act(async () => {
      vi.advanceTimersByTime(800);
    });
    
    expect(screen.getByText('AI PROCESSING')).toBeDefined();

    // Advance timers by 2500ms for "drafted" state
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    
    // Because sagaPadService.generateDraft is a promise, we need to flush microtasks
    await act(async () => {
      await Promise.resolve();
    });

    // The new log should now say DRAFT READY and have the mocked text
    const draftsReady = screen.getAllByText('DRAFT READY');
    expect(draftsReady.length).toBeGreaterThanOrEqual(3); // 2 initial + at least 1 new
    expect(screen.getByText('Mocked draft tweet for proof of ship.')).toBeDefined();
    expect(sagaPadService.generateDraft).toHaveBeenCalled();
  });
});
