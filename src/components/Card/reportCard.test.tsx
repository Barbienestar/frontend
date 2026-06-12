/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportCard from './reportCard';

jest.mock('../FileUpload/FileUpload', () => ({
  __esModule: true,
  default: ({
    onFileChange,
  }: {
    onFileChange?: (file: File | null) => void;
  }) => (
    <button
      data-testid="file-upload-mock"
      onClick={() =>
        onFileChange?.(new File([''], 'test.jpg', { type: 'image/jpeg' }))
      }
    >
      Subir archivo
    </button>
  ),
}));

jest.mock('@/components/SearchableSelect/SearchableSelect', () => ({
  SearchableSelect: ({
    onChange,
    placeholder,
  }: {
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <button data-testid={`select-${placeholder}`} onClick={() => onChange('1')}>
      {placeholder}
    </button>
  ),
}));

const baseProps = {
  medicineOptions: [{ value: '1', label: 'Aspirina' }],
  hospitalOptions: [{ value: '1', label: 'Hospital General' }],
  selectedMedicine: '',
  selectedHospital: '',
  description: '',
  onMedicineChange: jest.fn(),
  onHospitalChange: jest.fn(),
  onDescriptionChange: jest.fn(),
  onFileChange: jest.fn(),
  imageUrl: null,
};

const completeProps = {
  ...baseProps,
  selectedMedicine: '1',
  selectedHospital: '1',
  description: 'Hay escasez del medicamento.',
  imageUrl: 'https://example.com/receta.jpg',
};

describe('ReportCard', () => {
  afterEach(() => jest.clearAllMocks());

  describe('renderizado', () => {
    it('muestra el título "Datos del Reporte"', () => {
      // Arrange + Act
      render(<ReportCard {...baseProps} />);

      // Assert
      expect(screen.getByText('Datos del Reporte')).toBeInTheDocument();
    });

    it('muestra el textarea de descripción', () => {
      // Arrange + Act
      render(<ReportCard {...baseProps} />);

      // Assert
      expect(
        screen.getByPlaceholderText(/describe el problema/i)
      ).toBeInTheDocument();
    });

    it('muestra el botón Cancelar', () => {
      // Arrange + Act
      render(<ReportCard {...baseProps} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /cancelar/i })
      ).toBeInTheDocument();
    });
  });

  describe('estado del botón submit (isFormComplete)', () => {
    it('está deshabilitado cuando el form está incompleto', () => {
      // Arrange + Act
      render(<ReportCard {...baseProps} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /enviar reporte/i })
      ).toBeDisabled();
    });

    it('está habilitado cuando todos los campos están completos', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /enviar reporte/i })
      ).not.toBeDisabled();
    });

    it('está deshabilitado cuando falta solo selectedMedicine', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} selectedMedicine="" />);

      // Assert
      expect(
        screen.getByRole('button', { name: /enviar reporte/i })
      ).toBeDisabled();
    });

    it('está deshabilitado cuando description es solo espacios', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} description="   " />);

      // Assert
      expect(
        screen.getByRole('button', { name: /enviar reporte/i })
      ).toBeDisabled();
    });

    it('está deshabilitado cuando imageUrl es null', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} imageUrl={null} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /enviar reporte/i })
      ).toBeDisabled();
    });
  });

  describe('estado del botón submit (loading)', () => {
    it('deshabilita el submit y muestra "Enviando..." cuando isLoading=true', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} isLoading />);

      // Assert
      expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();
    });

    it('deshabilita el submit y muestra "Subiendo imagen..." cuando isUploading=true', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} isUploading />);

      // Assert
      expect(
        screen.getByRole('button', { name: /subiendo imagen/i })
      ).toBeDisabled();
    });

    it('prioriza "Subiendo imagen..." sobre "Enviando..." cuando ambos son true', () => {
      // Arrange + Act
      render(<ReportCard {...completeProps} isLoading isUploading />);

      // Assert
      expect(
        screen.getByRole('button', { name: /subiendo imagen/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /enviando\.\.\./i })
      ).not.toBeInTheDocument();
    });
  });

  describe('botón Cancelar', () => {
    it('llama a onCancel al hacer clic', () => {
      // Arrange
      const onCancel = jest.fn();
      render(<ReportCard {...baseProps} onCancel={onCancel} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      // Assert
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('está deshabilitado cuando isLoading=true', () => {
      // Arrange + Act
      render(<ReportCard {...baseProps} isLoading />);

      // Assert
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
    });
  });

  describe('submit del formulario', () => {
    it('llama a onSubmit cuando el form está completo', () => {
      // Arrange
      const onSubmit = jest.fn();
      render(<ReportCard {...completeProps} onSubmit={onSubmit} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /enviar reporte/i }));

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('no llama a onSubmit cuando el botón está deshabilitado', () => {
      // Arrange
      const onSubmit = jest.fn();
      render(<ReportCard {...baseProps} onSubmit={onSubmit} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /enviar reporte/i }));

      // Assert
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('callbacks de cambio de campo', () => {
    it('llama a onDescriptionChange con el valor introducido', () => {
      // Arrange
      const onDescriptionChange = jest.fn();
      render(
        <ReportCard {...baseProps} onDescriptionChange={onDescriptionChange} />
      );

      // Act
      fireEvent.change(screen.getByPlaceholderText(/describe el problema/i), {
        target: { value: 'Falta de medicamento en el hospital.' },
      });

      // Assert
      expect(onDescriptionChange).toHaveBeenCalledWith(
        'Falta de medicamento en el hospital.'
      );
    });

    it('llama a onMedicineChange cuando se selecciona un medicamento', () => {
      // Arrange
      const onMedicineChange = jest.fn();
      render(<ReportCard {...baseProps} onMedicineChange={onMedicineChange} />);

      // Act
      fireEvent.click(screen.getByTestId('select-Seleccione un medicamento'));

      // Assert
      expect(onMedicineChange).toHaveBeenCalledWith('1');
    });

    it('llama a onHospitalChange cuando se selecciona un hospital', () => {
      // Arrange
      const onHospitalChange = jest.fn();
      render(<ReportCard {...baseProps} onHospitalChange={onHospitalChange} />);

      // Act
      fireEvent.click(
        screen.getByTestId('select-Seleccione una unidad médica')
      );

      // Assert
      expect(onHospitalChange).toHaveBeenCalledWith('1');
    });

    it('llama a onFileChange cuando se adjunta un archivo', () => {
      // Arrange
      const onFileChange = jest.fn();
      render(<ReportCard {...baseProps} onFileChange={onFileChange} />);

      // Act
      fireEvent.click(screen.getByTestId('file-upload-mock'));

      // Assert
      expect(onFileChange).toHaveBeenCalledWith(expect.any(File));
    });
  });
});
