import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import StockFileUpload from './StockFileUpload';

const mockUploadMedicineStock = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('@/services/medicines/medicinesService', () => ({
  uploadMedicineStock: (...args: unknown[]) => mockUploadMedicineStock(...args),
}));

jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
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
          onFileChange?.(new File(['test'], 'test.csv', { type: 'text/csv' }))
        }
      />
      <button
        data-testid="mock-file-clear"
        onClick={() => onFileChange?.(null)}
      />
    </div>
  ),
}));

jest.mock('@/components/Button/button', () => ({
  Button: ({ children, asChild: _asChild, ...props }: { children?: ReactNode; asChild?: boolean; [key: string]: unknown }) => (
    <button data-testid="mock-button" {...(props as React.ComponentProps<'button'>)}>
      {children}
    </button>
  ),
}));

jest.mock('../ui/badge', () => ({
  Badge: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
    <span data-testid="badge" {...(props as React.ComponentProps<'span'>)}>
      {children}
    </span>
  ),
}));

jest.mock('../ui/card', () => ({
  Card: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
    <div data-testid="card" {...(props as React.ComponentProps<'div'>)}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children?: ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children?: ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardAction: ({ children }: { children?: ReactNode }) => (
    <div data-testid="card-action">{children}</div>
  ),
  CardFooter: ({ children }: { children?: ReactNode }) => (
    <div data-testid="card-footer">{children}</div>
  ),
}));

jest.mock('../ConfirmModal/ConfirmModal', () => ({
  ConfirmModal: ({
    message,
    isOpen,
    onConfirm,
    onCancel,
  }: {
    message: ReactNode;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <span>{message}</span>
        <button data-testid="mock-confirm" onClick={onConfirm} />
        <button data-testid="mock-cancel" onClick={onCancel} />
      </div>
    ) : null,
}));

jest.mock('lucide-react', () => ({
  Upload: () => <svg data-testid="upload-icon" />,
  Info: () => <svg data-testid="info-icon" />,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

describe('StockFileUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('when no hospitalId: shows "No hay hospital seleccionado" badge', () => {
    render(<StockFileUpload />);
    expect(
      screen.getByText('No hay hospital seleccionado')
    ).toBeInTheDocument();
  });

  it('when hospitalId provided: shows upload button', () => {
    render(<StockFileUpload hospitalId={1} />);
    expect(screen.getByText('Subir archivo')).toBeInTheDocument();
  });

  it('when hospitalName provided: shows badge with name', () => {
    render(
      <StockFileUpload hospitalId={1} hospitalName="Hospital General" />
    );
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
  });

  it('upload button disabled when no file', () => {
    render(<StockFileUpload hospitalId={1} />);
    const uploadBtn = screen.getByText('Subir archivo').closest('button');
    expect(uploadBtn).toBeDisabled();
  });

  it('upload button enabled after file selected', () => {
    render(<StockFileUpload hospitalId={1} />);
    fireEvent.click(screen.getByTestId('mock-file-select'));
    const uploadBtn = screen.getByText('Subir archivo').closest('button');
    expect(uploadBtn).not.toBeDisabled();
  });

  it('opens confirm modal when upload clicked with file', () => {
    render(<StockFileUpload hospitalId={1} />);
    fireEvent.click(screen.getByTestId('mock-file-select'));
    fireEvent.click(screen.getByText('Subir archivo').closest('button')!);
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('uploads file on confirm and shows success toast', async () => {
    mockUploadMedicineStock.mockResolvedValue(undefined);
    render(<StockFileUpload hospitalId={1} />);
    fireEvent.click(screen.getByTestId('mock-file-select'));
    fireEvent.click(screen.getByText('Subir archivo').closest('button')!);
    fireEvent.click(screen.getByTestId('mock-confirm'));
    await waitFor(() => {
      expect(mockUploadMedicineStock).toHaveBeenCalledWith(
        '1',
        expect.any(File)
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Archivo subido con éxito');
    });
  });

  it('shows error toast on upload failure', async () => {
    mockUploadMedicineStock.mockRejectedValue(new Error('Upload failed'));
    render(<StockFileUpload hospitalId={1} />);
    fireEvent.click(screen.getByTestId('mock-file-select'));
    fireEvent.click(screen.getByText('Subir archivo').closest('button')!);
    fireEvent.click(screen.getByTestId('mock-confirm'));
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalled();
    });
  });
});