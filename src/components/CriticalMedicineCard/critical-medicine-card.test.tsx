/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { CriticalMedicineCard } from './critical-medicine-card';

const defaultProps = {
  hospitalName: 'Hospital General',
  medicineName: 'Ibuprofeno',
  stock: 10,
};

describe('CriticalMedicineCard', () => {
  describe('renderizado de datos', () => {
    it('muestra el nombre del medicamento', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Ibuprofeno')).toBeInTheDocument();
    });

    it('muestra el nombre del hospital', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} />);

      // Assert
      expect(screen.getByText('Hospital General')).toBeInTheDocument();
    });

    it('muestra el stock con la etiqueta "piezas"', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={10} />);

      // Assert
      expect(screen.getByText('10 piezas')).toBeInTheDocument();
    });

    it('muestra la etiqueta "STOCK"', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} />);

      // Assert
      expect(screen.getByText('STOCK')).toBeInTheDocument();
    });
  });

  describe('estado crítico (stock < 5)', () => {
    it('aplica color rojo al stock cuando el valor es crítico', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={4} />);

      // Assert
      expect(screen.getByText('4 piezas')).toHaveClass('text-red-500');
    });

    it('aplica color rojo a la barra lateral cuando el stock es crítico', () => {
      // Arrange + Act
      const { container } = render(
        <CriticalMedicineCard {...defaultProps} stock={4} />
      );
      const bar = container.querySelector('.w-1');

      // Assert
      expect(bar).toHaveClass('bg-red-500');
    });

    it('stock === 0 se considera crítico', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={0} />);

      // Assert
      expect(screen.getByText('0 piezas')).toHaveClass('text-red-500');
    });
  });

  describe('estado no crítico (stock >= 5)', () => {
    it('aplica color ámbar al stock cuando el valor no es crítico', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={10} />);

      // Assert
      expect(screen.getByText('10 piezas')).toHaveClass('text-amber-500');
    });

    it('aplica color ámbar a la barra lateral cuando el stock no es crítico', () => {
      // Arrange + Act
      const { container } = render(
        <CriticalMedicineCard {...defaultProps} stock={10} />
      );
      const bar = container.querySelector('.w-1');

      // Assert
      expect(bar).toHaveClass('bg-amber-500');
    });
  });

  describe('valores en el umbral', () => {
    it('stock === 4 es crítico (rojo)', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={4} />);

      // Assert
      expect(screen.getByText('4 piezas')).toHaveClass('text-red-500');
    });

    it('stock === 5 no es crítico (ámbar)', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={5} />);

      // Assert
      expect(screen.getByText('5 piezas')).toHaveClass('text-amber-500');
    });

    it('no aplica color rojo cuando stock === 5', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={5} />);

      // Assert
      expect(screen.getByText('5 piezas')).not.toHaveClass('text-red-500');
    });

    it('no aplica color ámbar cuando stock === 4', () => {
      // Arrange + Act
      render(<CriticalMedicineCard {...defaultProps} stock={4} />);

      // Assert
      expect(screen.getByText('4 piezas')).not.toHaveClass('text-amber-500');
    });
  });
});
