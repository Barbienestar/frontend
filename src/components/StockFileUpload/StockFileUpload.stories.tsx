import type { Meta, StoryObj } from '@storybook/react-vite';
import StockFileUpload from './StockFileUpload';

const meta: Meta<typeof StockFileUpload> = {
  component: StockFileUpload,
} satisfies Meta<typeof StockFileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// Caso cuando no se ha seleccionado ningún hospital todavía
export const NoHospitalSelected: Story = {
  args: {},
};

// Caso con el hospital "20 de Noviembre"
export const Hospital20DeNoviembre: Story = {
  args: {
    hospitalId: 1092301920391,
    hospitalName: '20 de Noviembre',
  },
};

// Caso con el hospital "INER" 
export const HospitalINER: Story = {
  args: {
    hospitalId: 9876543210, 
    hospitalName: 'INER',
  },
};