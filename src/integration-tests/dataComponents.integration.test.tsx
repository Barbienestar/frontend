/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button/button';
import { RecentReportsTable } from '@/components/RecentReportsTable/recentReportsTable';
import { MetricCard } from '@/components/MetricCards/metric-card';
import { BarChart2 } from 'lucide-react';

describe('Data display components', () => {
  describe('Button', () => {
    it('renders with label', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with data-slot attributes', () => {
      render(<Button data-testid="btn">Test</Button>);
      const btn = screen.getByTestId('btn');
      expect(btn).toHaveAttribute('data-slot', 'button');
      expect(btn).toHaveAttribute('data-variant', 'default');
      expect(btn).toHaveAttribute('data-size', 'default');
    });

    it('calls onClick when clicked', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByText('Click'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders with custom variant', () => {
      render(
        <Button variant="destructive" data-testid="btn">
          Delete
        </Button>
      );
      expect(screen.getByTestId('btn')).toHaveAttribute(
        'data-variant',
        'destructive'
      );
    });
  });

  describe('RecentReportsTable', () => {
    const mockReports = [
      {
        folio: '001',
        medicine: 'Paracetamol',
        hospital: 'Hospital A',
        status: 'Atendido',
        statusColor: 'bg-green-100',
      },
    ];

    it('renders report rows', () => {
      render(<RecentReportsTable reports={mockReports} />);
      expect(screen.getByText('#001')).toBeInTheDocument();
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
      expect(screen.getByText('Atendido')).toBeInTheDocument();
    });

    it('renders header', () => {
      render(<RecentReportsTable reports={mockReports} />);
      expect(screen.getByText('Mis Reportes Recientes')).toBeInTheDocument();
    });

    it('calls onViewAll when link clicked', () => {
      const onViewAll = jest.fn();
      render(
        <RecentReportsTable reports={mockReports} onViewAll={onViewAll} />
      );
      fireEvent.click(screen.getByText('Ver todos →'));
      expect(onViewAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('MetricCard', () => {
    it('renders label and value', () => {
      render(
        <MetricCard
          label="Pendientes"
          value="150"
          icon={<BarChart2 data-testid="icon" />}
          trend="+12% vs ayer"
        />
      );
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('+12% vs ayer')).toBeInTheDocument();
    });

    it('renders with trend highlight', () => {
      render(
        <MetricCard
          label="Aprobados"
          value="42"
          icon={<BarChart2 data-testid="icon" />}
          trend="+8% vs ayer"
          trendHighlight="+8%"
        />
      );
      expect(screen.getByText('Aprobados')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });
});
