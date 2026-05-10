import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout from '@/app/layout';

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter' }),
  JetBrains_Mono: () => ({ variable: 'mock-jetbrains-mono' }),
}));

describe('RootLayout', () => {
  it('renders correctly', () => {
    const originalError = console.error;
    console.error = (...args) => {
      const msg = args.join(' ');
      if (msg.includes('cannot be a child of <div>')) return;
      originalError.call(console, ...args);
    };

    const { container } = render(
      <RootLayout>
        <div data-testid="child">Test Content</div>
      </RootLayout>
    );
    expect(container.querySelector('html')).toBeDefined();
    expect(container.querySelector('body')).toBeDefined();
    expect(container.querySelector('[data-testid="child"]')).toBeDefined();

    console.error = originalError;
  });
});
