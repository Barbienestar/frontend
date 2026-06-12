/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminReportsTable } from './AdminReportsTable';
import { getAdminPageReports } from '@/services/report/reportService';
import type { FullReportData } from '@/common/FullReportData';
import type { PaginatedResponse } from '@/common/PaginatedResponse';

jest.mock('@/services/report/reportService', () => ({
  getAdminPageReports: jest.fn(),
}));

jest.mock('./AdminReportsCard', () => ({
  AdminReportsCard: ({ data }: { data: FullReportData }) => (
    <div data-testid={`card-${data.id}`} />
  ),
}));

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

let uuidCounter = 0;
beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID: jest.fn(() => `test-uuid-${uuidCounter++}`) },
    configurable: true,
  });
});

const mockReport: FullReportData = {
  id: 1,
  description: 'Test description',
  imageUrl: 'https://example.com/img.jpg',
  userFullName: 'Test User',
  medicineName: 'Test Medicine',
  medicinePresentation: null,
  medicineDosageForm: null,
  hospitalName: 'Test Hospital',
  createdAt: '2024-01-01T00:00:00Z',
};

const defaultResponse: PaginatedResponse<FullReportData> = {
  items: [mockReport],
  page: 0,
  pageSize: 3,
  totalItems: 4,
  totalPages: 2,
};

describe('AdminReportsTable', () => {
  beforeEach(() => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(defaultResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('estado de carga', () => {
    it('muestra skeletons mientras los datos cargan', () => {
      // Arrange
      (getAdminPageReports as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      // Act
      render(<AdminReportsTable statusId={2} />);

      // Assert
      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });
  });

  describe('estado vacío', () => {
    it('muestra "No reports found" cuando no hay reportes', async () => {
      // Arrange
      (getAdminPageReports as jest.Mock).mockResolvedValue({
        ...defaultResponse,
        items: [],
        totalItems: 0,
      });

      // Act
      render(<AdminReportsTable statusId={2} />);

      // Assert
      expect(await screen.findByText('No reports found')).toBeInTheDocument();
    });
  });

  describe('estado con datos', () => {
    it('renderiza una card por cada reporte recibido', async () => {
      // Arrange
      (getAdminPageReports as jest.Mock).mockResolvedValue({
        ...defaultResponse,
        items: [mockReport, { ...mockReport, id: 2 }, { ...mockReport, id: 3 }],
      });

      // Act
      render(<AdminReportsTable statusId={2} />);

      // Assert
      expect(await screen.findByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
      expect(screen.getByTestId('card-3')).toBeInTheDocument();
    });

    it('muestra el texto de paginación correcto', async () => {
      // Arrange — defaultResponse: page=0, totalPages=2, totalItems=4

      // Act
      render(<AdminReportsTable statusId={2} />);

      // Assert
      expect(
        await screen.findByText('Page 1 of 2 (4 total)')
      ).toBeInTheDocument();
    });
  });

  describe('botón Previous', () => {
    it('está deshabilitado en la primera página', async () => {
      // Arrange
      render(<AdminReportsTable statusId={2} />);

      // Act — esperar a que los datos carguen
      await screen.findByTestId('card-1');

      // Assert
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    });

    it('está habilitado después de navegar a la siguiente página', async () => {
      // Arrange
      render(<AdminReportsTable statusId={2} />);
      await screen.findByTestId('card-1');

      // Act
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await screen.findByTestId('card-1');

      // Assert
      expect(
        screen.getByRole('button', { name: /previous/i })
      ).not.toBeDisabled();
    });
  });

  describe('botón Next', () => {
    it('está habilitado cuando hay más páginas disponibles', async () => {
      // Arrange — defaultResponse: page=0, totalPages=2

      // Act
      render(<AdminReportsTable statusId={2} />);
      await screen.findByTestId('card-1');

      // Assert
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('está deshabilitado en la última página', async () => {
      // Arrange
      (getAdminPageReports as jest.Mock).mockResolvedValue({
        ...defaultResponse,
        page: 0,
        totalPages: 1,
      });

      // Act
      render(<AdminReportsTable statusId={2} />);
      await screen.findByTestId('card-1');

      // Assert
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });
  });

  describe('llamadas al servicio', () => {
    it('llama al servicio con statusId, page=0 y pageSize al montar', async () => {
      // Arrange
      render(<AdminReportsTable statusId={2} pageSize={5} />);

      // Act — esperar la llamada inicial
      await screen.findByTestId('card-1');

      // Assert
      expect(getAdminPageReports).toHaveBeenCalledWith(2, 0, 5);
    });

    it('llama al servicio con page+1 al hacer clic en Next', async () => {
      // Arrange
      render(<AdminReportsTable statusId={2} />);
      await screen.findByTestId('card-1');

      // Act
      fireEvent.click(screen.getByRole('button', { name: /next/i }));

      // Assert
      await waitFor(() => {
        expect(getAdminPageReports).toHaveBeenCalledWith(2, 1, 3);
      });
    });

    it('llama al servicio con page-1 al hacer clic en Previous desde página 1', async () => {
      // Arrange
      render(<AdminReportsTable statusId={2} />);
      await screen.findByTestId('card-1');
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await screen.findByTestId('card-1');

      // Act
      fireEvent.click(screen.getByRole('button', { name: /previous/i }));

      // Assert
      await waitFor(() => {
        expect(getAdminPageReports).toHaveBeenLastCalledWith(2, 0, 3);
      });
    });
  });
});
