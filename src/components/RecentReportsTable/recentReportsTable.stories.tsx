import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReportRow } from './recentReportsTable';
import { RecentReportsTable } from './recentReportsTable';

const meta: Meta<typeof RecentReportsTable> = {
  title: 'Components/RecentReportsTable',
  component: RecentReportsTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RecentReportsTable>;

const sampleReports: ReportRow[] = [
  {
    folio: '#48291',
    medicine: 'Metformina 850mg',
    hospital: 'IMSS Clínica 14',
    status: 'En revisión',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    folio: '#48150',
    medicine: 'Insulina Glargina',
    hospital: 'Hospital General, CDMX',
    status: 'Atendido',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    folio: '#47983',
    medicine: 'Paracetamol 500mg',
    hospital: 'ISSSTE Clínica Norte',
    status: 'Rechazado',
    statusColor: 'bg-red-100 text-red-700',
  },
];

export const Default: Story = {
  args: {
    reports: sampleReports,
    onViewAll: () => alert('Ver todos los reportes'),
  },
};

export const SingleReport: Story = {
  args: {
    reports: [sampleReports[0]],
    onViewAll: () => alert('Ver todos'),
  },
};

export const AllStatuses: Story = {
  name: 'Todos los estatus',
  args: {
    reports: [
      {
        folio: '#48001',
        medicine: 'Amoxicilina 500mg',
        hospital: 'IMSS HGZ #1',
        status: 'En revisión',
        statusColor: 'bg-yellow-100 text-yellow-700',
      },
      {
        folio: '#48002',
        medicine: 'Omeprazol 20mg',
        hospital: 'SSA Centro de Salud Tlalpan',
        status: 'Atendido',
        statusColor: 'bg-green-100 text-green-700',
      },
      {
        folio: '#48003',
        medicine: 'Losartán 50mg',
        hospital: 'ISSSTE Clínica Sur',
        status: 'Rechazado',
        statusColor: 'bg-red-100 text-red-700',
      },
    ],
    onViewAll: () => alert('Ver todos'),
  },
};

export const Empty: Story = {
  name: 'Sin reportes',
  args: {
    reports: [],
    onViewAll: () => alert('Ver todos'),
  },
};

