import type { Meta, StoryObj } from '@storybook/react-vite';
import HospitalStockCard from './hospitalStockCard';

const meta = {
  title: 'Components/HospitalStockCard',
  component: HospitalStockCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof HospitalStockCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  medicineName: 'Metformina 850mg',
  onClick: () => {},
};

export const Disponible: Story = {
  args: {
    ...base,
    data: {
      hospitalId: 1,
      hospitalName: 'Hospital General de México',
      address: 'Dr. Balmis 148, Cuauhtémoc, CDMX',
      stockLabel: 'Stock Alto',
      status: 'Disponible',
      mapsUrl: 'https://maps.google.com/?q=@19.4326,-99.1332,15z',
    },
  },
};

export const Limitado: Story = {
  args: {
    ...base,
    data: {
      hospitalId: 2,
      hospitalName: 'Clínica IMSS No. 28',
      address: 'Gabriel Mancera 222, Benito Juárez, CDMX',
      stockLabel: '5 pzas restantes',
      status: 'Limitado',
      mapsUrl: 'https://maps.google.com/?q=@19.3984,-99.1677,15z',
    },
  },
};

export const Agotado: Story = {
  args: {
    ...base,
    data: {
      hospitalId: 3,
      hospitalName: 'Centro de Salud T-III',
      address: 'Av. Coyoacán s/n, Benito Juárez, CDMX',
      stockLabel: 'No disponible',
      status: 'Agotado',
      mapsUrl: null,
    },
  },
};

export const Selected: Story = {
  args: {
    ...Disponible.args,
    selected: true,
  },
};

export const SinUbicacion: Story = {
  args: {
    ...base,
    data: {
      hospitalId: 4,
      hospitalName: 'Instituto Nacional de Cardiología',
      address: 'Juan Badiano 1, Tlalpan, CDMX',
      stockLabel: 'Stock Alto',
      status: 'Disponible',
      mapsUrl: null,
    },
  },
};
