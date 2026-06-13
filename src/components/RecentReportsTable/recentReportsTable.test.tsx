/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { RecentReportsTable } from './recentReportsTable';
import type { ReportRow } from './recentReportsTable';

const mockReports: ReportRow[] = [
  {
    folio: '001',
    medicine: 'Paracetamol',
    hospital: 'Hospital General',
    status: 'Pendiente',
    statusColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    folio: '002',
    medicine: 'Ibuprofeno',
    hospital: 'Hospital Central',
    status: 'Aprobado',
    statusColor: 'bg-green-100 text-green-800',
  },
];

describe('RecentReportsTable', () => {
  it('renders header', () => {
    render(<RecentReportsTable reports={[]} />);

    expect(screen.getByText('Mis Reportes Recientes')).toBeInTheDocument();
  });

  it('renders "Ver todos →" button', () => {
    render(<RecentReportsTable reports={[]} />);

    expect(screen.getByText('Ver todos →')).toBeInTheDocument();
  });

  it('renders table with Folio, Medicamento, Estatus columns', () => {
    render(<RecentReportsTable reports={[]} />);

    expect(screen.getByText('Folio')).toBeInTheDocument();
    expect(screen.getByText('Medicamento')).toBeInTheDocument();
    expect(screen.getByText('Estatus')).toBeInTheDocument();
  });

  it('renders report rows with folio, medicine, hospital, status', () => {
    render(<RecentReportsTable reports={mockReports} />);

    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();

    expect(screen.getByText('#002')).toBeInTheDocument();
    expect(screen.getByText('Ibuprofeno')).toBeInTheDocument();
    expect(screen.getByText('Hospital Central')).toBeInTheDocument();
    expect(screen.getByText('Aprobado')).toBeInTheDocument();
  });

  it('renders status with statusColor class', () => {
    const { container } = render(<RecentReportsTable reports={mockReports} />);

    const statusSpans = container.querySelectorAll('td span');
    expect(statusSpans[0].className).toContain('bg-yellow-100');
    expect(statusSpans[1].className).toContain('bg-green-100');
  });

  it('renders empty tbody when no reports', () => {
    const { container } = render(<RecentReportsTable reports={[]} />);

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody).toBeEmptyDOMElement();
  });
});
