/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import { PeriodStockReportGraph } from './PeriodStockReportGraph';

jest.mock('@/services/report-snapshots/reportSnapshotsService', () => ({
  getPeriodReportSnapshots: jest.fn(),
}));

import { getPeriodReportSnapshots } from '@/services/report-snapshots/reportSnapshotsService';

describe('PeriodStockReportGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when no hospitalId', () => {
    render(<PeriodStockReportGraph hospitalId={undefined} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/Selecciona un hospital/)).toBeInTheDocument();
  });

  it('shows loading state while fetching', async () => {
    (getPeriodReportSnapshots as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );
    render(<PeriodStockReportGraph hospitalId={1} />);

    await waitFor(() => {
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('shows error state on fetch failure', async () => {
    (getPeriodReportSnapshots as jest.Mock).mockRejectedValue(
      new Error('Fail')
    );
    render(<PeriodStockReportGraph hospitalId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
    });
  });

  it('renders chart title', () => {
    render(<PeriodStockReportGraph hospitalId={undefined} />);
    expect(screen.getByText('Reportes por Periodo')).toBeInTheDocument();
  });

  it('renders date range pickers', () => {
    render(<PeriodStockReportGraph hospitalId={1} />);
    const buttons = screen.getAllByRole('button');
    // Date picker buttons present
    expect(buttons.length).toBeGreaterThan(0);
  });
});
