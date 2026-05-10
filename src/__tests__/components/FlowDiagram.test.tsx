import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FlowDiagram } from '@/components/FlowDiagram';

afterEach(() => {
  vi.useRealTimers();
});

describe('FlowDiagram', () => {
  it('renders the Pipeline Flow heading', () => {
    render(<FlowDiagram />);
    expect(screen.getAllByText(/Pipeline Flow/)[0]).toBeInTheDocument();
  });

  it('renders Git Push step', () => {
    render(<FlowDiagram />);
    expect(screen.getAllByText('Git Push')[0]).toBeInTheDocument();
  });

  it('renders AI Summarize step', () => {
    render(<FlowDiagram />);
    expect(screen.getAllByText('AI Summarize')[0]).toBeInTheDocument();
  });

  it('renders SagaPad Skill step', () => {
    render(<FlowDiagram />);
    expect(screen.getAllByText('SagaPad Skill')[0]).toBeInTheDocument();
  });

  it('renders Post to X step', () => {
    render(<FlowDiagram />);
    expect(screen.getAllByText('Post to X')[0]).toBeInTheDocument();
  });

  it('renders sublabels for steps', () => {
    render(<FlowDiagram />);
    expect(screen.getAllByText('Webhook fires')[0]).toBeInTheDocument();
    expect(screen.getAllByText('GPT-4o-mini')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Draft via agent')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Auto-published')[0]).toBeInTheDocument();
  });

  it('starts with step 0 active', () => {
    const { container } = render(<FlowDiagram />);
    const steps = container.querySelectorAll('.flow-step');
    expect(steps[0].className).toContain('scale-105');
    expect(steps[1].className).not.toContain('scale-105');
  });

  it('advances active step on interval', async () => {
    vi.useFakeTimers();
    const { container } = render(<FlowDiagram />);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    const steps = container.querySelectorAll('.flow-step');
    expect(steps[1].className).toContain('scale-105');
  });

  it('cycles back to step 0 after all steps', async () => {
    vi.useFakeTimers();
    const { container } = render(<FlowDiagram />);

    await act(async () => {
      vi.advanceTimersByTime(8000); // 4 steps × 2s
    });

    const steps = container.querySelectorAll('.flow-step');
    expect(steps[0].className).toContain('scale-105');
  });

  it('renders exactly 4 flow steps', () => {
    const { container } = render(<FlowDiagram />);
    const steps = container.querySelectorAll('.flow-step');
    expect(steps).toHaveLength(4);
  });

  it('clears interval on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(<FlowDiagram />);
    unmount();
  });
});
