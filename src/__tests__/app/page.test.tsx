import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LandingPage from '@/app/page';

vi.mock('@/components/ParticleBackground', () => ({
  ParticleBackground: () => <div data-testid="particle-bg" />,
}));

vi.mock('@/components/ScrambleText', () => ({
  ScrambleText: ({ text }: { text: string }) => <span data-testid="scramble-text">{text}</span>,
}));

describe('LandingPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('renders landing page correctly', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('particle-bg')).toBeDefined();
    expect(screen.getAllByTestId('scramble-text').length).toBe(2);
    expect(screen.getByText('Shiproof')).toBeDefined();
    expect(screen.getByText('Launch Dashboard')).toBeDefined();
  });

  it('runs terminal demo animation', () => {
    render(<LandingPage />);
    
    // Initially lines array is empty, but then timeouts add lines
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText('$ git push origin main')).toBeDefined();
    
    act(() => {
      vi.advanceTimersByTime(10000); // Advance enough to show all lines
    });
    
    expect(screen.getByText('[sagapad] ✓ Pipeline complete in 2.4s')).toBeDefined();
  });
});
