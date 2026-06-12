/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { type VariantProps } from 'class-variance-authority';
import { Button } from './button';
import buttonVariants from './buttonVariants';

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

describe('Button', () => {
  describe('renderizado básico', () => {
    it('renderiza un elemento button por defecto', () => {
      // Arrange + Act
      render(<Button>Click</Button>);

      // Assert
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renderiza los children correctamente', () => {
      // Arrange + Act
      render(<Button>Guardar</Button>);

      // Assert
      expect(screen.getByText('Guardar')).toBeInTheDocument();
    });

    it('tiene el atributo data-slot="button"', () => {
      // Arrange + Act
      render(<Button>Click</Button>);

      // Assert
      expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
    });
  });

  describe('valores por defecto', () => {
    it('usa variant="default" cuando no se especifica variant', () => {
      // Arrange + Act
      render(<Button>Click</Button>);

      // Assert
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'default'
      );
    });

    it('usa size="default" cuando no se especifica size', () => {
      // Arrange + Act
      render(<Button>Click</Button>);

      // Assert
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-size',
        'default'
      );
    });
  });

  describe('variantes', () => {
    const variantCases: [ButtonVariant][] = [
      ['outline'],
      ['secondary'],
      ['ghost'],
      ['destructive'],
      ['link'],
    ];
    it.each(variantCases)(
      'aplica data-variant="%s" correctamente',
      (variant) => {
        // Arrange + Act
        render(<Button variant={variant}>Click</Button>);

        // Assert
        expect(screen.getByRole('button')).toHaveAttribute(
          'data-variant',
          variant
        );
      }
    );
  });

  describe('tamaños', () => {
    const sizeCases: [ButtonSize][] = [['xs'], ['sm'], ['lg'], ['icon']];
    it.each(sizeCases)(
      'aplica data-size="%s" correctamente',
      (size) => {
        // Arrange + Act
        render(<Button size={size}>Click</Button>);

        // Assert
        expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
      }
    );
  });

  describe('props nativas', () => {
    it('llama a onClick cuando se hace clic', () => {
      // Arrange
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      // Act
      fireEvent.click(screen.getByRole('button'));

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('no llama a onClick cuando está disabled', () => {
      // Arrange
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click
        </Button>
      );

      // Act
      fireEvent.click(screen.getByRole('button'));

      // Assert
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('está deshabilitado cuando se pasa la prop disabled', () => {
      // Arrange + Act
      render(<Button disabled>Click</Button>);

      // Assert
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('aplica el atributo type cuando se provee', () => {
      // Arrange + Act
      render(<Button type="submit">Enviar</Button>);

      // Assert
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('aplica className adicional al elemento', () => {
      // Arrange + Act
      render(<Button className="mi-clase-custom">Click</Button>);

      // Assert
      expect(screen.getByRole('button')).toHaveClass('mi-clase-custom');
    });

    it('reenvía props adicionales al elemento raíz', () => {
      // Arrange + Act
      render(<Button aria-label="Cerrar diálogo">X</Button>);

      // Assert
      expect(
        screen.getByRole('button', { name: 'Cerrar diálogo' })
      ).toBeInTheDocument();
    });
  });

  describe('asChild', () => {
    it('renderiza el elemento hijo como raíz cuando asChild es true', () => {
      // Arrange + Act
      render(
        <Button asChild>
          <a href="/inicio">Ir al inicio</a>
        </Button>
      );

      // Assert
      expect(
        screen.getByRole('link', { name: /ir al inicio/i })
      ).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('transfiere data-slot al elemento hijo con asChild', () => {
      // Arrange + Act
      render(
        <Button asChild>
          <a href="/inicio">Ir al inicio</a>
        </Button>
      );

      // Assert
      expect(screen.getByRole('link')).toHaveAttribute('data-slot', 'button');
    });

    it('transfiere data-variant al elemento hijo con asChild', () => {
      // Arrange + Act
      render(
        <Button asChild variant="outline">
          <a href="/inicio">Ir al inicio</a>
        </Button>
      );

      // Assert
      expect(screen.getByRole('link')).toHaveAttribute(
        'data-variant',
        'outline'
      );
    });
  });
});
