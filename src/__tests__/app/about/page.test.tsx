import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from '@/app/about/page';

vi.mock('@/components/ParticleBackground', () => ({
  ParticleBackground: () => <div data-testid="particle-bg" />,
}));

vi.mock('@/components/ScrambleText', () => ({
  ScrambleText: ({ text }: { text: string }) => <span data-testid="scramble-text">{text}</span>,
}));

describe('AboutPage', () => {
  it('renders about page correctly', () => {
    render(<AboutPage />);
    expect(screen.getByTestId('particle-bg')).toBeDefined();
    expect(screen.getAllByTestId('scramble-text').length).toBe(2);
    expect(screen.getByText('Back to Dashboard')).toBeDefined();
    expect(screen.getByText('Step-by-Step Flow')).toBeDefined();
    expect(screen.getByText('Tech Stack')).toBeDefined();
    expect(screen.getByText('Hackathon')).toBeDefined();
  });
});
