/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AdminReportsTable } from './AdminReportsTable';

jest.mock('@/services/report/reportService', () => ({
  getAdminPageReports: jest.fn(),
}));

import { getAdminPageReports } from '@/services/report/reportService';
import type { FullReportData } from '@/common/FullReportData';

const mockReport: FullReportData = {
  id: 1,
  description: 'Falta medicamento',
  imageUrl: '/img.jpg',
  userFullName: 'Juan Pérez',
  medicineName: 'Paracetamol',
  medicinePresentation: 'Tableta',
  medicineDosageForm: '500mg',
  hospitalName: 'Hospital General',
  createdAt: '2024-01-15T10:00:00Z',
};

const mockResponse = {
  items: [mockReport],
  page: 0,
  pageSize: 3,
  totalItems: 1,
  totalPages: 1,
};

const mockResponseMultiPage = {
  items: Array.from({ length: 3 }, (_, i) => ({
    ...mockReport,
    id: i + 1,
  })),
  page: 0,
  pageSize: 3,
  totalItems: 7,
  totalPages: 3,
};

describe('AdminReportsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading skeletons initially', () => {
    (getAdminPageReports as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<AdminReportsTable statusId={2} />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders reports after loading', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponse);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    });
  });

  it('shows empty state when no reports', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue({
      items: [],
      page: 0,
      pageSize: 3,
      totalItems: 0,
      totalPages: 0,
    });
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(
        screen.getByText('No se encontraron reportes')
      ).toBeInTheDocument();
    });
  });

  it('renders pagination with total info', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponseMultiPage);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(screen.getByText(/Página 1 de 3/)).toBeInTheDocument();
      expect(screen.getByText(/7 total/)).toBeInTheDocument();
    });
  });

  it('disables prev button on first page', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponseMultiPage);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      const prevBtn = screen.getByText('Anterior').closest('button');
      expect(prevBtn).toBeDisabled();
    });
  });

  it('enables next button when more pages', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponseMultiPage);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      const nextBtn = screen.getByText('Siguiente').closest('button');
      expect(nextBtn).not.toBeDisabled();
    });
  });

  it('calls getAdminPageReports with correct params', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponse);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(getAdminPageReports).toHaveBeenCalledWith(2, 0, 3);
    });
  });

  it('calls onAccept when accept button clicked', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponse);
    const onAccept = jest.fn();
    render(<AdminReportsTable statusId={2} onAccept={onAccept} />);

    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    });
  });

  it('navigates to next page on Siguiente click', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponseMultiPage);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(screen.getByText(/Página 1 de 3/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => {
      expect(getAdminPageReports).toHaveBeenCalledWith(2, 1, 3);
    });
  });

  it('navigates to previous page on Anterior click', async () => {
    const mockResponsePage1 = {
      ...mockResponseMultiPage,
      page: 1,
    };
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponsePage1);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(screen.getByText(/Página 2 de 3/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Anterior'));
    await waitFor(() => {
      expect(getAdminPageReports).toHaveBeenCalledWith(2, 0, 3);
    });
  });

  it('disables prev button on first page', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponseMultiPage);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      const prevBtn = screen.getByText('Anterior').closest('button');
      expect(prevBtn).toBeDisabled();
    });
  });

  it('enables next button when more pages', async () => {
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockResponseMultiPage);
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      const nextBtn = screen.getByText('Siguiente').closest('button');
      expect(nextBtn).not.toBeDisabled();
    });
  });

  it('disables next button on last page', async () => {
    const mockSinglePage = {
      items: [mockReport],
      page: 0,
      pageSize: 3,
      totalItems: 1,
      totalPages: 1,
    };
    (getAdminPageReports as jest.Mock).mockResolvedValue(mockSinglePage);
    render(<AdminReportsTable statusId={2} pageSize={3} />);

    await waitFor(() => {
      expect(screen.getByText(/Página 1 de 1/)).toBeInTheDocument();
    });
    const nextBtn = screen.getByText('Siguiente').closest('button');
    expect(nextBtn).toBeDisabled();
  });

  it('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (getAdminPageReports as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );
    render(<AdminReportsTable statusId={2} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('admin-reject-report-button')
      ).not.toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });
});
