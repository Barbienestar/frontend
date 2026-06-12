/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  describe('renderizado estructural', () => {
    it('renderiza un elemento nav como contenedor', () => {
      // Arrange
      const items = [{ label: 'Inicio' }];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renderiza sin errores cuando items está vacío', () => {
      // Arrange
      const items: never[] = [];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.queryByText('/')).toBeNull();
    });
  });

  describe('item con href', () => {
    it('renderiza el item como enlace cuando tiene href', () => {
      // Arrange
      const items = [{ label: 'Inicio', href: '/' }];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
    });

    it('el enlace apunta al href correcto', () => {
      // Arrange
      const items = [{ label: 'Admin', href: '/admin' }];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getByRole('link', { name: /admin/i })).toHaveAttribute(
        'href',
        '/admin'
      );
    });
  });

  describe('item sin href', () => {
    it('renderiza el item como texto plano cuando no tiene href', () => {
      // Arrange
      const items = [{ label: 'Reportes' }];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getByText('Reportes')).toBeInTheDocument();
    });

    it('no renderiza un enlace para el item sin href', () => {
      // Arrange
      const items = [{ label: 'Reportes' }];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.queryByRole('link')).toBeNull();
    });
  });

  describe('separadores', () => {
    it('no muestra separador antes del primer item', () => {
      // Arrange
      const items = [{ label: 'Inicio', href: '/' }];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.queryByText('/')).toBeNull();
    });

    it('muestra un separador "/" entre cada par de items', () => {
      // Arrange
      const items = [
        { label: 'Inicio', href: '/' },
        { label: 'Admin', href: '/admin' },
        { label: 'Reportes' },
      ];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getAllByText('/')).toHaveLength(items.length - 1);
    });
  });

  describe('lista mixta', () => {
    it('renderiza correctamente una lista con enlaces y item activo combinados', () => {
      // Arrange
      const items = [
        { label: 'Inicio', href: '/' },
        { label: 'Admin', href: '/admin' },
        { label: 'Reportes' },
      ];

      // Act
      render(<Breadcrumb items={items} />);

      // Assert
      expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute(
        'href',
        '/'
      );
      expect(screen.getByRole('link', { name: /admin/i })).toHaveAttribute(
        'href',
        '/admin'
      );
      expect(screen.getByText('Reportes')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /reportes/i })).toBeNull();
      expect(screen.getAllByText('/')).toHaveLength(2);
    });
  });
});
