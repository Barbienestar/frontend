/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders Disponible with green styles', () => {
    render(<StatusBadge variant="Disponible" />);
    const badge = screen.getByText('Disponible');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('green');
  });

  it('renders Agotado with red styles', () => {
    render(<StatusBadge variant="Agotado" />);
    const badge = screen.getByText('Agotado');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('red');
  });

  it('renders Limitado with yellow styles', () => {
    render(<StatusBadge variant="Limitado" />);
    const badge = screen.getByText('Limitado');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('yellow');
  });
});
