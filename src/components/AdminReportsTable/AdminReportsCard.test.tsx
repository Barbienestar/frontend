/**
 * @jest-environment jsdom
 */

// HTMLDialogElement polyfill
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
}

import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AdminReportsCard } from './AdminReportsCard';
import type { FullReportData } from '@/common/FullReportData';

const mockReport: FullReportData = {
  id: 1,
  description: 'Falta medicamento urgente',
  imageUrl: '/img.jpg',
  userFullName: 'Juan Pérez',
  medicineName: 'Paracetamol',
  medicinePresentation: 'Tableta',
  medicineDosageForm: '500mg',
  hospitalName: 'Hospital General',
  createdAt: '2024-01-15T10:00:00Z',
};

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <button {...(props as React.ComponentProps<'button'>)}>{children}</button>
  ),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children?: ReactNode }) => (
    <div data-testid="dialog">{children}</div>
  ),
  DialogContent: ({ children }: { children?: ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogTrigger: ({ children }: { children?: ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
}));

jest.mock('@/components/ui/aspect-ratio', () => ({
  AspectRatio: ({ children }: { children?: ReactNode }) => (
    <div data-testid="aspect-ratio">{children}</div>
  ),
}));

jest.mock('@/components/ConfirmModal/ConfirmModal', () => ({
  ConfirmModal: ({
    isOpen,
    message,
    onConfirm,
    onCancel,
  }: {
    isOpen: boolean;
    message: ReactNode;
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

describe('AdminReportsCard', () => {
  const onAccept = jest.fn();
  const onReject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders report information', () => {
    render(<AdminReportsCard data={mockReport} />);
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
    expect(screen.getAllByText('Falta medicamento urgente')).toHaveLength(2);
  });

  it('renders accept and reject buttons', () => {
    render(<AdminReportsCard data={mockReport} />);
    expect(
      screen.getByTestId('admin-accept-report-button')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('admin-reject-report-button')
    ).toBeInTheDocument();
  });

  it('shows confirm modal on accept click', () => {
    render(<AdminReportsCard data={mockReport} />);
    fireEvent.click(screen.getByTestId('admin-accept-report-button'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(
      screen.getByText('¿Está seguro que desea aceptar este reporte?')
    ).toBeInTheDocument();
  });

  it('shows confirm modal on reject click', () => {
    render(<AdminReportsCard data={mockReport} />);
    fireEvent.click(screen.getByTestId('admin-reject-report-button'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(
      screen.getByText('¿Está seguro que desea rechazar este reporte?')
    ).toBeInTheDocument();
  });

  it('calls onAccept on confirm', () => {
    render(<AdminReportsCard data={mockReport} onAccept={onAccept} />);
    fireEvent.click(screen.getByTestId('admin-accept-report-button'));
    fireEvent.click(screen.getByTestId('mock-confirm'));
    expect(onAccept).toHaveBeenCalledWith(mockReport);
  });

  it('calls onReject on confirm', () => {
    render(<AdminReportsCard data={mockReport} onReject={onReject} />);
    fireEvent.click(screen.getByTestId('admin-reject-report-button'));
    fireEvent.click(screen.getByTestId('mock-confirm'));
    expect(onReject).toHaveBeenCalledWith(mockReport);
  });

  it('cancels confirm modal', () => {
    render(<AdminReportsCard data={mockReport} />);
    fireEvent.click(screen.getByTestId('admin-accept-report-button'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('mock-cancel'));
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('shows "Sin hospital asignado" when no hospital', () => {
    const reportNoHospital = { ...mockReport, hospitalName: null };
    render(<AdminReportsCard data={reportNoHospital} />);
    expect(screen.getByText('Sin hospital asignado')).toBeInTheDocument();
  });

  it('does not call onAccept/onReject when handler not provided', () => {
    render(<AdminReportsCard data={mockReport} />);
    fireEvent.click(screen.getByTestId('admin-accept-report-button'));
    fireEvent.click(screen.getByTestId('mock-confirm'));
    fireEvent.click(screen.getByTestId('admin-reject-report-button'));
    fireEvent.click(screen.getByTestId('mock-confirm'));
    expect(onAccept).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
  });
});
