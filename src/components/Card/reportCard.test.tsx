import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import ReportCard from './reportCard';

jest.mock('../Button/button', () => ({
  Button: ({
    children,
    disabled: _d,
    ...props
  }: {
    children?: ReactNode;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button {...(props as React.ComponentProps<'button'>)}>{children}</button>
  ),
}));

jest.mock('../FileUpload/FileUpload', () => ({
  __esModule: true,
  default: ({
    onFileChange,
    testId,
  }: {
    onFileChange?: (f: File | null) => void;
    testId?: string;
  }) => (
    <div data-testid={testId}>
      <button
        data-testid="mock-file-select"
        onClick={() =>
          onFileChange?.(new File([''], 'test.jpg', { type: 'image/jpeg' }))
        }
      />
    </div>
  ),
}));

jest.mock('@/components/SearchableSelect/SearchableSelect', () => ({
  SearchableSelect: ({
    inputTestId,
    onChange,
    value,
    options,
  }: {
    inputTestId?: string;
    onChange: (v: string) => void;
    value: string;
    options: { value: string; label: string }[];
  }) => (
    <select
      data-testid={inputTestId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('lucide-react', () => ({
  ClipboardList: () => <svg data-testid="clipboard-icon" />,
  Loader2: () => <svg data-testid="loader-icon" />,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const defaultProps = {
  medicineOptions: [
    { value: 'med1', label: 'Medicine 1' },
    { value: 'med2', label: 'Medicine 2' },
  ],
  hospitalOptions: [
    { value: 'hosp1', label: 'Hospital 1' },
    { value: 'hosp2', label: 'Hospital 2' },
  ],
  selectedMedicine: '',
  selectedHospital: '',
  description: '',
  onMedicineChange: jest.fn(),
  onHospitalChange: jest.fn(),
  onDescriptionChange: jest.fn(),
  onFileChange: jest.fn(),
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
};

describe('ReportCard', () => {
  it('renders "Datos del Reporte" title', () => {
    render(<ReportCard {...defaultProps} />);
    expect(screen.getByText('Datos del Reporte')).toBeInTheDocument();
  });

  it('renders "Enviar Reporte" button', () => {
    render(<ReportCard {...defaultProps} />);
    expect(screen.getByText('Enviar Reporte')).toBeInTheDocument();
  });

  it('shows "Subiendo imagen..." when isUploading', () => {
    render(<ReportCard {...defaultProps} isUploading={true} />);
    expect(screen.getByText('Subiendo imagen...')).toBeInTheDocument();
  });

  it('shows "Enviando..." when isLoading', () => {
    render(<ReportCard {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty form', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(screen.getByText('Selecciona un medicamento.')).toBeInTheDocument();
    expect(
      screen.getByText('Selecciona una unidad médica.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Escribe una descripción del problema.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Adjunta una imagen de la receta.')
    ).toBeInTheDocument();
  });

  it('calls onSubmit when form is complete and submitted', () => {
    const onSubmit = jest.fn();
    render(
      <ReportCard
        {...defaultProps}
        selectedMedicine="med1"
        selectedHospital="hosp1"
        description="Test description"
        imageUrl="http://example.com/image.jpg"
        onSubmit={onSubmit}
      />
    );
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('submits with empty form clears errors before setting new ones', () => {
    const onSubmit = jest.fn();
    const { rerender } = render(
      <ReportCard
        {...defaultProps}
        selectedMedicine="med1"
        selectedHospital="hosp1"
        description="Test description"
        imageUrl="http://example.com/image.jpg"
        onSubmit={onSubmit}
      />
    );
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    onSubmit.mockClear();
    rerender(<ReportCard {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Selecciona un medicamento.')).toBeInTheDocument();
  });

  it('clears medicine error after selecting a medicine', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(screen.getByText('Selecciona un medicamento.')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('report-search-medicine-input'), {
      target: { value: 'med1' },
    });
    expect(
      screen.queryByText('Selecciona un medicamento.')
    ).not.toBeInTheDocument();
  });

  it('clears hospital error after selecting a hospital', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(
      screen.getByText('Selecciona una unidad médica.')
    ).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('report-search-hospital-input'), {
      target: { value: 'hosp1' },
    });
    expect(
      screen.queryByText('Selecciona una unidad médica.')
    ).not.toBeInTheDocument();
  });

  it('clears description error after typing', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(
      screen.getByText('Escribe una descripción del problema.')
    ).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'New description' },
    });
    expect(
      screen.queryByText('Escribe una descripción del problema.')
    ).not.toBeInTheDocument();
  });

  it('clears image error after selecting a file', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByTestId('report-submit-button'));
    expect(
      screen.getByText('Adjunta una imagen de la receta.')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('mock-file-select'));
    expect(
      screen.queryByText('Adjunta una imagen de la receta.')
    ).not.toBeInTheDocument();
  });
});
