/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminReportsCard } from './AdminReportsCard';
import type { FullReportData } from '@/common/FullReportData';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('@/components/ui/aspect-ratio', () => ({
  AspectRatio: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ConfirmModal/ConfirmModal', () => ({
  ConfirmModal: ({
    isOpen,
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
  }: {
    isOpen: boolean;
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-modal="true">
        <p>{message}</p>
        <button onClick={onConfirm}>{confirmLabel ?? 'Aceptar'}</button>
        <button onClick={onCancel}>{cancelLabel ?? 'Cancelar'}</button>
      </div>
    );
  },
}));

const mockData: FullReportData = {
  id: 1,
  description: 'Patient reported adverse reaction after taking medication.',
  imageUrl: 'https://example.com/image.jpg',
  userFullName: 'John Doe',
  medicineName: 'Aspirin',
  medicinePresentation: '500mg tablet',
  medicineDosageForm: 'Oral',
  hospitalName: 'General Hospital',
  createdAt: '2024-01-15T10:30:00Z',
};

describe('AdminReportsCard', () => {
  describe('renderizado inicial', () => {
    it('muestra la información del reporte correctamente', () => {
      // Arrange
      render(<AdminReportsCard data={mockData} />);

      // Assert
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
      expect(screen.getByText('General Hospital')).toBeInTheDocument();
    });

    it('muestra "No hospital provided" cuando hospitalName es null', () => {
      // Arrange
      const dataWithoutHospital: FullReportData = {
        ...mockData,
        hospitalName: null,
      };
      render(<AdminReportsCard data={dataWithoutHospital} />);

      // Assert
      expect(screen.getByText('No hospital provided')).toBeInTheDocument();
    });

    it('no muestra el modal de confirmación al montar el componente', () => {
      // Arrange
      render(<AdminReportsCard data={mockData} />);

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('flujo de aceptación', () => {
    it('abre el modal con el mensaje correcto al hacer clic en Accept', () => {
      // Arrange
      const onAccept = jest.fn();
      render(<AdminReportsCard data={mockData} onAccept={onAccept} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /accept/i }));

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('¿Está seguro que desea aceptar este reporte?')
      ).toBeInTheDocument();
    });

    it('llama a onAccept con los datos del reporte al confirmar', () => {
      // Arrange
      const onAccept = jest.fn();
      render(<AdminReportsCard data={mockData} onAccept={onAccept} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /accept/i }));
      fireEvent.click(screen.getByRole('button', { name: /sí, aceptar/i }));

      // Assert
      expect(onAccept).toHaveBeenCalledTimes(1);
      expect(onAccept).toHaveBeenCalledWith(mockData);
    });

    it('cierra el modal después de confirmar la aceptación', () => {
      // Arrange
      const onAccept = jest.fn();
      render(<AdminReportsCard data={mockData} onAccept={onAccept} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /accept/i }));
      fireEvent.click(screen.getByRole('button', { name: /sí, aceptar/i }));

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('flujo de rechazo', () => {
    it('abre el modal con el mensaje correcto al hacer clic en Reject', () => {
      // Arrange
      const onReject = jest.fn();
      render(<AdminReportsCard data={mockData} onReject={onReject} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /reject/i }));

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('¿Está seguro que desea rechazar este reporte?')
      ).toBeInTheDocument();
    });

    it('llama a onReject con los datos del reporte al confirmar', () => {
      // Arrange
      const onReject = jest.fn();
      render(<AdminReportsCard data={mockData} onReject={onReject} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /reject/i }));
      fireEvent.click(screen.getByRole('button', { name: /sí, rechazar/i }));

      // Assert
      expect(onReject).toHaveBeenCalledTimes(1);
      expect(onReject).toHaveBeenCalledWith(mockData);
    });

    it('cierra el modal después de confirmar el rechazo', () => {
      // Arrange
      const onReject = jest.fn();
      render(<AdminReportsCard data={mockData} onReject={onReject} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /reject/i }));
      fireEvent.click(screen.getByRole('button', { name: /sí, rechazar/i }));

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('cancelación del modal', () => {
    it('no llama a onAccept cuando se cancela el modal de aceptación', () => {
      // Arrange
      const onAccept = jest.fn();
      render(<AdminReportsCard data={mockData} onAccept={onAccept} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /accept/i }));
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      // Assert
      expect(onAccept).not.toHaveBeenCalled();
    });

    it('cierra el modal al hacer clic en Cancelar', () => {
      // Arrange
      render(<AdminReportsCard data={mockData} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /reject/i }));
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
