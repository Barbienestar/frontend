// --- Mocks de módulos externos ---
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}));

// Mockeamos los componentes de layout que no están bajo prueba
// y que tienen dependencias de router/auth/contextos externos.
jest.mock('@/components/Global/navbar', () => ({
  __esModule: true,
  default: () => <nav data-testid="mock-navbar" />,
}));
jest.mock('@/components/Global/footer', () => ({
  Footer: () => <footer data-testid="mock-footer" />,
}));
jest.mock('@/components/Breadcrumb/breadcrumb', () => ({
  Breadcrumb: () => <nav aria-label="breadcrumb" />,
}));
jest.mock('@/components/PageHeader/pageHeader', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyReportsPage from '@/pages/myReports';
import api from '@/services/api';
import type { ReportData } from '@/common/ReportData ';

const mockedApi = api as jest.Mocked<typeof api>;

const fakeReports: ReportData[] = [
  {
    id: 1,
    medicineName: 'Metformina',
    hospitalName: 'Hospital General Sur',
    status: 'reviewing',
    description: 'Sin existencias desde el lunes',
    imageUrl: 'https://cdn.example.com/1.png',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 2,
    medicineName: 'Paracetamol',
    hospitalName: 'IMSS Zona Norte',
    status: 'accepted',
    description: 'Falta de paracetamol infantil',
    imageUrl: 'https://cdn.example.com/2.png',
    createdAt: '2025-03-05T08:30:00Z',
    updatedAt: '2025-03-06T12:00:00Z',
  },
  {
    id: 3,
    medicineName: 'Insulina NPH',
    hospitalName: 'Clínica del Este',
    status: 'declined',
    description: 'No hay insulina disponible',
    imageUrl: 'https://cdn.example.com/3.png',
    createdAt: '2025-03-10T14:00:00Z',
    updatedAt: '2025-03-11T09:00:00Z',
  },
];

describe('Listado "Mis Reportes" — integración (HU-11)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los reportes devueltos por la API con sus medicamentos y estados', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: fakeReports });

    render(<MyReportsPage />);

    // Primero muestra estado de carga
    expect(screen.getByText('Cargando reportes...')).toBeInTheDocument();

    // Luego aparecen los reportes
    await waitFor(() =>
      expect(screen.getByText('Metformina')).toBeInTheDocument()
    );
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Insulina NPH')).toBeInTheDocument();

    // Verifica las etiquetas de estatus en las filas (aparecen también en el <select>,
    // por eso usamos getAllByText y comprobamos que al menos hay una coincidencia real en la tabla)
    expect(screen.getAllByText('En revisión').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Atendido').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Rechazado').length).toBeGreaterThanOrEqual(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/reports/me');
  });

  it('el filtro de búsqueda muestra solo los reportes que coinciden', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: fakeReports });

    render(<MyReportsPage />);
    await waitFor(() =>
      expect(screen.getByText('Metformina')).toBeInTheDocument()
    );

    await user.type(
      screen.getByTestId('my-reports-search-input'),
      'paracetamol'
    );

    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
      expect(screen.queryByText('Metformina')).not.toBeInTheDocument();
      expect(screen.queryByText('Insulina NPH')).not.toBeInTheDocument();
    });
  });

  it('el filtro de estatus muestra solo reportes con ese estado', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: fakeReports });

    render(<MyReportsPage />);
    await waitFor(() =>
      expect(screen.getByText('Metformina')).toBeInTheDocument()
    );

    await user.selectOptions(
      screen.getByTestId('my-reports-status-filter'),
      'accepted'
    );

    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
      expect(screen.queryByText('Metformina')).not.toBeInTheDocument();
      expect(screen.queryByText('Insulina NPH')).not.toBeInTheDocument();
    });
  });

  it('muestra mensaje de error cuando la API falla', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

    render(<MyReportsPage />);

    await waitFor(() =>
      expect(
        screen.getByText('Error al cargar tus reportes. Intenta de nuevo.')
      ).toBeInTheDocument()
    );
  });

  it('muestra "No se encontraron reportes" cuando la lista está vacía', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });

    render(<MyReportsPage />);

    await waitFor(() =>
      expect(
        screen.getByText('No se encontraron reportes.')
      ).toBeInTheDocument()
    );
  });
});
