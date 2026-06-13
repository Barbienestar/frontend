/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { InformativeCard } from './informative-card';

jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: React.PropsWithChildren) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardDescription: ({ children }: React.PropsWithChildren) => (
    <div data-testid="card-description">{children}</div>
  ),
}));

describe('InformativeCard', () => {
  it('renders title and description', () => {
    render(
      <InformativeCard
        title="Title Test"
        description="Description Test"
        icon={<span data-testid="test-icon" />}
      />
    );

    expect(screen.getByText('Title Test')).toBeInTheDocument();
    expect(screen.getByText('Description Test')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <InformativeCard
        title="Title"
        description="Description"
        icon={<span data-testid="test-icon" />}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies className prop', () => {
    const { container } = render(
      <InformativeCard
        title="Title"
        description="Description"
        icon={<span />}
        className="custom-class"
      />
    );

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
