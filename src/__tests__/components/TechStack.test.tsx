import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TechStack } from '@/components/TechStack';

describe('TechStack', () => {
  it('renders correctly', () => {
    render(<TechStack />);
    expect(screen.getByText('Next.js 16')).toBeDefined();
    expect(screen.getByText('React 19')).toBeDefined();
    expect(screen.getByText('Tailwind v4')).toBeDefined();
    expect(screen.getByText('Solana')).toBeDefined();
  });
});
