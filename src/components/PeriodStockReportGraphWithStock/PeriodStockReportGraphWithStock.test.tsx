/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import { PeriodStockReportGraphWithStock } from './PeriodStockReportGraphWithStock';

jest.mock('@/services/report-snapshots/reportSnapshotsService', () => ({
  getPeriodReportSnapshotsWithStock: jest.fn(),
}));

import { getPeriodReportSnapshotsWithStock } from '@/services/report-snapshots/reportSnapshotsService';

describe('PeriodStockReportGraphWithStock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when no hospitalId', () => {
    render(<PeriodStockReportGraphWithStock hospitalId={undefined} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/Selecciona un hospital/)).toBeInTheDocument();
  });

  it('shows loading state while fetching', async () => {
    (getPeriodReportSnapshotsWithStock as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );
    render(<PeriodStockReportGraphWithStock hospitalId={1} />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('shows error state on fetch failure', async () => {
    (getPeriodReportSnapshotsWithStock as jest.Mock).mockRejectedValue(
      new Error('Fail')
    );
    render(<PeriodStockReportGraphWithStock hospitalId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
    });
  });

  it('renders chart title', () => {
    render(<PeriodStockReportGraphWithStock hospitalId={undefined} />);
    expect(screen.getByText('Reportes vs stock oficial')).toBeInTheDocument();
  });

  it('renders date range pickers', () => {
    render(<PeriodStockReportGraphWithStock hospitalId={1} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
