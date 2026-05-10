import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FlowDiagram } from '@/components/FlowDiagram';

afterEach(() => {
  vi.useRealTimers();
});

describe('FlowDiagram', () => {
  it('renders the Pipeline Flow heading', () => {
    render(<FlowDiagram />);
    expect(screen.getByText(/Pipeline Flow/)).toBeInTheDocument();
  });

  it('renders Git Push step', () => {
    render(<FlowDiagram />);
    expect(screen.getByText('Git Push')).toBeInTheDocument();
  });

  it('renders AI Summarize step', () => {
    render(<FlowDiagram />);
    expect(screen.getByText('AI Summarize')).toBeInTheDocument();
  });

  it('renders SagaPad Skill step', () => {
    render(<FlowDiagram />);
    expect(screen.getByText('SagaPad Skill')).toBeInTheDocument();
  });

  it('renders Post to X step', () => {
    render(<FlowDiagram />);
    expect(screen.getByText('Post to X')).toBeInTheDocument();
  });

  it('renders sublabels for steps', () => {
    render(<FlowDiagram />);
    expect(screen.getByText('Webhook fires')).toBeInTheDocument();
    expect(screen.getByText('GPT-4o-mini')).toBeInTheDocument();
    expect(screen.getByText('Draft via agent')).toBeInTheDocument();
    expect(screen.getByText('Auto-published')).toBeInTheDocument();
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
});
