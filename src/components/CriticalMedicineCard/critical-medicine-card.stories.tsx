import type { Meta, StoryObj } from '@storybook/react-vite';
import { CriticalMedicineCard } from './critical-medicine-card';

const meta = {
  component: CriticalMedicineCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CriticalMedicineCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    hospitalName: 'Hospital General de Zona #1',
    medicineName: 'Amoxicilina 500mg',
    stock: 65,
  },
};

export const Danger: Story = {
  args: {
    hospitalName: 'Hospital General de Zona #2',
    medicineName: 'Metformina 850mg',
    stock: 12,
  },
};
