import type { Meta, StoryObj } from '@storybook/react-vite';
import StockFileUpload from './StockFileUpload';

const meta: Meta<typeof StockFileUpload> = {
  component: StockFileUpload,
} satisfies Meta<typeof StockFileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyHospitals: Story = { args: { hospitals: [] } };

export const SingleHospital: Story = {
  args: {
    hospitals: [{ id: '1092301920391', name: '20 de Noviembre' }],
  },
};

export const MultipleHospitals: Story = {
  args: {
    hospitals: [
      { id: '1092301920391', name: '20 de Noviembre' },
      { id: '09asd9a-a112', name: 'INER' },
    ],
  },
};
