/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { PageHeader } from './pageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Dashboard'
    );
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Dashboard" subtitle="Resumen general" />);
    expect(screen.getByText('Resumen general')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
