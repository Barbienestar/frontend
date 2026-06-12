/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './metric-card';

const defaultProps = {
  label: 'Pendientes',
  value: 124,
  icon: <span data-testid="icon" />,
  trend: '+12% vs. semana pasada',
};

describe('MetricCard', () => {
  describe('renderizado de datos', () => {
    it('muestra el label', () => {
      // Arrange + Act
      render(<MetricCard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
    });

    it('muestra el value', () => {
      // Arrange + Act
      render(<MetricCard {...defaultProps} value={124} />);

      // Assert
      expect(screen.getByText(124)).toBeInTheDocument();
    });

    it('muestra el icon', () => {
      // Arrange + Act
      render(<MetricCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('renderizado de trend sin trendHighlight', () => {
    it('muestra el texto de trend completo como texto plano', () => {
      // Arrange + Act
      render(<MetricCard {...defaultProps} />);

      // Assert
      expect(screen.getByText('+12% vs. semana pasada')).toBeInTheDocument();
    });

    it('no crea un span separado para el highlight', () => {
      // Arrange + Act
      const { container } = render(<MetricCard {...defaultProps} />);
      const trendEl = container.querySelector(
        '[data-slot="metric-card-trend"]'
      );

      // Assert — solo un nodo de texto, sin spans hijos
      expect(trendEl?.querySelector('span')).not.toBeInTheDocument();
    });
  });

  describe('renderizado de trend con trendHighlight', () => {
    it('separa y muestra el highlight en un span cuando coincide con el inicio', () => {
      // Arrange + Act
      render(<MetricCard {...defaultProps} trendHighlight="+12%" />);

      // Assert
      expect(screen.getByText('+12%').tagName).toBe('SPAN');
    });

    it('muestra el resto del texto fuera del span', () => {
      // Arrange + Act
      const { container } = render(
        <MetricCard {...defaultProps} trendHighlight="+12%" />
      );
      const trendEl = container.querySelector(
        '[data-slot="metric-card-trend"]'
      );

      // Assert — el texto " vs. semana pasada" existe como nodo suelto en el trend
      expect(trendEl?.textContent).toBe('+12% vs. semana pasada');
      expect(screen.getByText('+12%').tagName).toBe('SPAN');
    });

    it('muestra trend como texto plano cuando trendHighlight no coincide con el inicio', () => {
      // Arrange + Act
      const { container } = render(
        <MetricCard
          {...defaultProps}
          trend="+12% vs. semana pasada"
          trendHighlight="semana"
        />
      );
      const trendEl = container.querySelector(
        '[data-slot="metric-card-trend"]'
      );

      // Assert — sin span, texto completo en el nodo
      expect(trendEl?.querySelector('span')).not.toBeInTheDocument();
      expect(screen.getByText('+12% vs. semana pasada')).toBeInTheDocument();
    });
  });

  describe('color del highlight según variant', () => {
    it('aplica text-blue-600 al highlight con variant="pending"', () => {
      // Arrange + Act
      render(
        <MetricCard {...defaultProps} trendHighlight="+12%" variant="pending" />
      );

      // Assert
      expect(screen.getByText('+12%')).toHaveClass('text-blue-600');
    });

    it('aplica text-green-600 al highlight con variant="approved"', () => {
      // Arrange + Act
      render(
        <MetricCard
          {...defaultProps}
          trendHighlight="+12%"
          variant="approved"
        />
      );

      // Assert
      expect(screen.getByText('+12%')).toHaveClass('text-green-600');
    });

    it('aplica text-red-500 al highlight con variant="rejected"', () => {
      // Arrange + Act
      render(
        <MetricCard
          {...defaultProps}
          trendHighlight="+12%"
          variant="rejected"
        />
      );

      // Assert
      expect(screen.getByText('+12%')).toHaveClass('text-red-500');
    });
  });
});
