import type { Meta, StoryObj } from '@storybook/react-vite';
import ReportCard from './reportCard';

const meta: Meta<typeof ReportCard> = {
  component: ReportCard,
} satisfies Meta<typeof ReportCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    medicineOptions: [],
    hospitalOptions: [],
    selectedMedicine: '',
    selectedHospital: '',
    description: '',
    onMedicineChange: () => {},
    onHospitalChange: () => {},
    onDescriptionChange: () => {},
    onFileChange: () => {},
  },
};
