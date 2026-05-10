import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders Shiproof branding text', () => {
    render(<Footer />);
    expect(screen.getAllByText(/Shiproof/)[0]).toBeInTheDocument();
  });

  it('renders the "S" logo badge', () => {
    render(<Footer />);
    expect(screen.getAllByText('S')[0]).toBeInTheDocument();
  });

  it('renders GitHub link with correct href', () => {
    render(<Footer />);
    const link = screen.getAllByText('GitHub ↗')[0];
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('github.com'));
  });

  it('renders GitHub link with noopener noreferrer', () => {
    render(<Footer />);
    const link = screen.getAllByText('GitHub ↗')[0];
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders SagaPad Skills link', () => {
    render(<Footer />);
    const link = screen.getAllByText('SagaPad Skills ↗')[0];
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('sagapad.com'));
  });

  it('renders hackathon attribution', () => {
    render(<Footer />);
    expect(screen.getAllByText(/Colosseum Frontier 2026/)[0]).toBeInTheDocument();
  });

  it('renders as a footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
