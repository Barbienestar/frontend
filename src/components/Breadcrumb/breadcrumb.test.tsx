/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  it('renders nav with items', () => {
    const items = [
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos' },
      { label: 'Detalle' },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Detalle')).toBeInTheDocument();
  });

  it('renders separator between items', () => {
    const items = [{ label: 'Inicio', href: '/' }, { label: 'Detalle' }];

    render(<Breadcrumb items={items} />);

    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(1);
  });

  it('renders anchor when href exists, span when not', () => {
    const items = [{ label: 'Inicio', href: '/' }, { label: 'Detalle' }];

    render(<Breadcrumb items={items} />);

    const link = screen.getByText('Inicio');
    expect(link.tagName).toBe('A');

    const span = screen.getByText('Detalle');
    expect(span.tagName).toBe('SPAN');
  });

  it('renders empty nav when items is empty', () => {
    const { container } = render(<Breadcrumb items={[]} />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toBeEmptyDOMElement();
  });
});
