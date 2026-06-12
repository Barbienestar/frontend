// --- Mocks de módulos externos ---
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}));

// La imagen del reporte se muestra en un <Dialog> de radix-ui que usa portales;
// lo mockeamos para evitar problemas con portales en jsdom.
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <>{children}</>,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-content">{children}</div>
  ),
}));

import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminReportsCard } from '@/components/AdminReportsTable/AdminReportsCard';
import { changeReportStatus } from '@/services/report/reportService';
import type { FullReportData } from '@/common/FullReportData';
import api from '@/services/api';

const mockedApi = api as jest.Mocked<typeof api>;

const fakeReport: FullReportData = {
  id: 7,
  description: 'Sin existencias de Metformina desde hace una semana',
  imageUrl: 'https://cdn.example.com/receta7.png',
  userFullName: 'María García Pérez',
  medicineName: 'Metformina',
  medicinePresentation: 'Caja 30 tabletas',
  medicineDosageForm: 'Tableta',
  hospitalName: 'Hospital Regional Norte',
  createdAt: '2025-02-01T09:00:00Z',
};

/**
 * Wrapper que conecta AdminReportsCard con changeReportStatus,
 * reflejando el nuevo estado en la UI (igual que haría admin.tsx).
 */
const AdminCardConServicio = () => {
  const [statusLabel, setStatusLabel] = useState<string | null>(null);

  const handleAccept = async (report: FullReportData) => {
    await changeReportStatus(report.id, 2); // 2 = aceptado
    setStatusLabel('Aceptado');
  };

  const handleReject = async (report: FullReportData) => {
    await changeReportStatus(report.id, 3); // 3 = rechazado
    setStatusLabel('Rechazado');
  };

  return (
    <>
      <AdminReportsCard
        data={fakeReport}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      {statusLabel && <p data-testid="admin-status-result">{statusLabel}</p>}
    </>
  );
};

describe('Validación de reporte por admin — integración (HU-10)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('al aceptar un reporte llama a api.put con el id y status correctos (2)', async () => {
    const user = userEvent.setup();
    mockedApi.put.mockResolvedValueOnce({});

    render(<AdminCardConServicio />);

    await user.click(screen.getByTestId('admin-accept-report-button'));
    // ConfirmModal aparece con "Sí, aceptar"
    await waitFor(() =>
      expect(screen.getByTestId('confirmation-modal')).toHaveAttribute('open')
    );
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() => {
      expect(mockedApi.put).toHaveBeenCalledWith('/reports/7/status/2');
    });
  });

  it('al aceptar, la UI refleja el nuevo estado "Aceptado"', async () => {
    const user = userEvent.setup();
    mockedApi.put.mockResolvedValueOnce({});

    render(<AdminCardConServicio />);

    await user.click(screen.getByTestId('admin-accept-report-button'));
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() =>
      expect(screen.getByTestId('admin-status-result')).toHaveTextContent(
        'Aceptado'
      )
    );
  });

  it('al rechazar un reporte llama a api.put con el id y status correctos (3)', async () => {
    const user = userEvent.setup();
    mockedApi.put.mockResolvedValueOnce({});

    render(<AdminCardConServicio />);

    await user.click(screen.getByTestId('admin-reject-report-button'));
    // ConfirmModal aparece con "Sí, rechazar"
    await waitFor(() =>
      expect(screen.getByTestId('confirmation-modal')).toHaveAttribute('open')
    );
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() => {
      expect(mockedApi.put).toHaveBeenCalledWith('/reports/7/status/3');
    });
  });

  it('al rechazar, la UI refleja el nuevo estado "Rechazado"', async () => {
    const user = userEvent.setup();
    mockedApi.put.mockResolvedValueOnce({});

    render(<AdminCardConServicio />);

    await user.click(screen.getByTestId('admin-reject-report-button'));
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() =>
      expect(screen.getByTestId('admin-status-result')).toHaveTextContent(
        'Rechazado'
      )
    );
  });
});
