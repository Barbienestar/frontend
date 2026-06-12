/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

const makeFile = (name: string, type: string) =>
  new File(['contenido'], name, { type });

describe('FileUpload', () => {
  describe('renderizado inicial (variante receta)', () => {
    it('muestra el texto principal de la variante receta', () => {
      // Arrange + Act
      render(<FileUpload />);

      // Assert
      expect(
        screen.getByText(/arrastre la imagen de su receta/i)
      ).toBeInTheDocument();
    });

    it('muestra el subtexto con los formatos aceptados', () => {
      // Arrange + Act
      render(<FileUpload />);

      // Assert
      expect(
        screen.getByText(/formatos aceptados: jpg, png, pdf/i)
      ).toBeInTheDocument();
    });

    it('no muestra el botón de eliminar al montar', () => {
      // Arrange + Act
      const { container } = render(<FileUpload />);

      // Assert
      expect(container.querySelector('button')).not.toBeInTheDocument();
    });

    it('no muestra el mensaje de error cuando error=false', () => {
      // Arrange + Act
      render(<FileUpload error={false} />);

      // Assert
      expect(
        screen.queryByText('Este campo es obligatorio.')
      ).not.toBeInTheDocument();
    });
  });

  describe('variante csv', () => {
    it('muestra el texto principal de la variante csv', () => {
      // Arrange + Act
      render(<FileUpload variant="csv" />);

      // Assert
      expect(screen.getByText(/arrastra tu archivo csv/i)).toBeInTheDocument();
    });

    it('el input acepta solo archivos csv', () => {
      // Arrange + Act
      const { container } = render(<FileUpload variant="csv" />);

      // Assert
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveAttribute('accept', '.csv,text/csv');
    });
  });

  describe('prop error', () => {
    it('muestra "Este campo es obligatorio." cuando error=true', () => {
      // Arrange + Act
      render(<FileUpload error />);

      // Assert
      expect(
        screen.getByText('Este campo es obligatorio.')
      ).toBeInTheDocument();
    });

    it('no muestra el mensaje de error cuando error=false', () => {
      // Arrange + Act
      render(<FileUpload error={false} />);

      // Assert
      expect(
        screen.queryByText('Este campo es obligatorio.')
      ).not.toBeInTheDocument();
    });
  });

  describe('selección de archivo via input', () => {
    it('muestra el nombre del archivo tras seleccionarlo', () => {
      // Arrange
      const file = makeFile('receta.jpg', 'image/jpeg');
      const { container } = render(<FileUpload />);
      const input = container.querySelector('input[type="file"]')!;

      // Act
      fireEvent.change(input, { target: { files: [file] } });

      // Assert
      expect(screen.getByText('receta.jpg')).toBeInTheDocument();
    });

    it('llama a onFileChange con el archivo seleccionado', () => {
      // Arrange
      const onFileChange = jest.fn();
      const file = makeFile('receta.jpg', 'image/jpeg');
      const { container } = render(<FileUpload onFileChange={onFileChange} />);
      const input = container.querySelector('input[type="file"]')!;

      // Act
      fireEvent.change(input, { target: { files: [file] } });

      // Assert
      expect(onFileChange).toHaveBeenCalledWith(file);
    });

    it('muestra el botón de eliminar después de seleccionar un archivo', () => {
      // Arrange
      const file = makeFile('receta.jpg', 'image/jpeg');
      const { container } = render(<FileUpload />);
      const input = container.querySelector('input[type="file"]')!;

      // Act
      fireEvent.change(input, { target: { files: [file] } });

      // Assert
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('llama a onFileChange con null cuando el input se limpia', () => {
      // Arrange
      const onFileChange = jest.fn();
      const { container } = render(<FileUpload onFileChange={onFileChange} />);
      const input = container.querySelector('input[type="file"]')!;

      // Act
      fireEvent.change(input, { target: { files: [] } });

      // Assert
      expect(onFileChange).toHaveBeenCalledWith(null);
    });
  });

  describe('eliminar archivo', () => {
    const setupWithFile = (onFileChange = jest.fn()) => {
      const file = makeFile('receta.pdf', 'application/pdf');
      const { container } = render(<FileUpload onFileChange={onFileChange} />);
      const input = container.querySelector('input[type="file"]')!;
      fireEvent.change(input, { target: { files: [file] } });
      return { container, onFileChange };
    };

    it('oculta el nombre del archivo y muestra el estado inicial al eliminar', () => {
      // Arrange
      const { container } = setupWithFile();

      // Act
      fireEvent.click(container.querySelector('button')!);

      // Assert
      expect(screen.queryByText('receta.pdf')).not.toBeInTheDocument();
      expect(
        screen.getByText(/arrastre la imagen de su receta/i)
      ).toBeInTheDocument();
    });

    it('llama a onFileChange(null) al hacer clic en el botón de eliminar', () => {
      // Arrange
      const onFileChange = jest.fn();
      const { container } = setupWithFile(onFileChange);

      // Act
      fireEvent.click(container.querySelector('button')!);

      // Assert
      expect(onFileChange).toHaveBeenLastCalledWith(null);
    });
  });

  describe('drag and drop', () => {
    // El FieldLabel renderiza el primer <label> del DOM; el drop zone es el segundo
    const getDropZone = (container: HTMLElement) =>
      container.querySelector<HTMLLabelElement>(
        'label:not([data-slot="field-label"])'
      )!;

    const dropWithFiles = (label: HTMLElement, files: File[]) => {
      const event = createEvent.drop(label);
      Object.defineProperty(event, 'dataTransfer', {
        value: { files },
        configurable: true,
      });
      fireEvent(label, event);
    };

    it('aplica la clase de arrastre activo al hacer dragOver', () => {
      // Arrange
      const { container } = render(<FileUpload />);
      const dropZone = getDropZone(container);

      // Act
      fireEvent.dragOver(dropZone);

      // Assert
      expect(dropZone.className).toContain('border-primary');
    });

    it('elimina la clase de arrastre al hacer dragLeave', () => {
      // Arrange
      const { container } = render(<FileUpload />);
      const dropZone = getDropZone(container);
      fireEvent.dragOver(dropZone);

      // Act
      fireEvent.dragLeave(dropZone);

      // Assert
      expect(dropZone.className).not.toContain('border-primary');
    });

    it('establece el archivo y llama a onFileChange al hacer drop', () => {
      // Arrange
      const onFileChange = jest.fn();
      const file = makeFile('inventario.csv', 'text/csv');
      const { container } = render(
        <FileUpload variant="csv" onFileChange={onFileChange} />
      );

      // Act
      dropWithFiles(getDropZone(container), [file]);

      // Assert
      expect(screen.getByText('inventario.csv')).toBeInTheDocument();
      expect(onFileChange).toHaveBeenCalledWith(file);
    });

    it('no llama a onFileChange si se suelta sin archivos', () => {
      // Arrange
      const onFileChange = jest.fn();
      const { container } = render(<FileUpload onFileChange={onFileChange} />);

      // Act
      dropWithFiles(getDropZone(container), []);

      // Assert
      expect(onFileChange).not.toHaveBeenCalled();
    });
  });
});
