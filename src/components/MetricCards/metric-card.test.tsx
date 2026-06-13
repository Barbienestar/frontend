/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { MetricCard } from './metric-card';

jest.mock('@/components/ui/metric-card', () => ({
  MetricCard: ({
    children,
    variant,
    className,
  }: React.PropsWithChildren<{ variant?: string; className?: string }>) => (
    <div data-testid="metric-card" data-variant={variant} className={className}>
      {children}
    </div>
  ),
  MetricCardHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="metric-card-header">{children}</div>
  ),
  MetricCardIcon: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="metric-card-icon" className={className}>
      {children}
    </div>
  ),
  MetricCardLabel: ({ children }: React.PropsWithChildren) => (
    <div data-testid="metric-card-label">{children}</div>
  ),
  MetricCardTrend: ({ children }: React.PropsWithChildren) => (
    <div data-testid="metric-card-trend">{children}</div>
  ),
  MetricCardValue: ({ children }: React.PropsWithChildren) => (
    <div data-testid="metric-card-value">{children}</div>
  ),
}));

describe('MetricCard', () => {
  it('renders label, value, trend', () => {
    render(
      <MetricCard
        label="Pendientes"
        value={124}
        icon={<span data-testid="icon" />}
        trend="+12% vs. semana pasada"
      />
    );

    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    expect(screen.getByText('124')).toBeInTheDocument();
    expect(screen.getByText('+12% vs. semana pasada')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <MetricCard
        label="Label"
        value={0}
        icon={<span data-testid="icon" />}
        trend="trend"
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('splits trend text with colored span when trendHighlight matches start', () => {
    render(
      <MetricCard
        label="Label"
        value={0}
        icon={<span />}
        trend="+12% vs. semana pasada"
        trendHighlight="+12%"
      />
    );

    const trendEl = screen.getByTestId('metric-card-trend');
    expect(trendEl.innerHTML).toContain('+12%');
    expect(trendEl.innerHTML).toContain(' vs. semana pasada');
    expect(trendEl.querySelector('.font-semibold')?.textContent).toBe('+12%');
  });

  it('renders plain trend without trendHighlight', () => {
    render(
      <MetricCard
        label="Label"
        value={0}
        icon={<span />}
        trend="+12% vs. semana pasada"
      />
    );

    expect(screen.getByText('+12% vs. semana pasada')).toBeInTheDocument();
  });

  it('applies variant: pending (blue), approved (green), rejected (red)', () => {
    const { rerender } = render(
      <MetricCard
        label="Label"
        value={0}
        icon={<span />}
        trend="trend"
        variant="pending"
      />
    );

    let iconEl = screen.getByTestId('metric-card-icon');
    expect(iconEl.className).toContain('text-blue-600');

    rerender(
      <MetricCard
        label="Label"
        value={0}
        icon={<span />}
        trend="trend"
        variant="approved"
      />
    );

    iconEl = screen.getByTestId('metric-card-icon');
    expect(iconEl.className).toContain('text-green-600');

    rerender(
      <MetricCard
        label="Label"
        value={0}
        icon={<span />}
        trend="trend"
        variant="rejected"
      />
    );

    iconEl = screen.getByTestId('metric-card-icon');
    expect(iconEl.className).toContain('text-red-500');
  });
});
