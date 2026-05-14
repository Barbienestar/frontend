import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FullReportData } from '@/common/FullReportData';
import { AdminReportsCard } from './AdminReportsCard';

const meta: Meta<typeof AdminReportsCard> = {
  title: 'Components/AdminReportsTable/AdminReportsCard',
  component: AdminReportsCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AdminReportsCard>;

const mockReport: FullReportData = {
  id: 1,
  createdAt: new Date('2023-03-01T00:00:00.000Z').getTime().toString(),
  description:
    'Patient reports severe skin rash after taking the medication for 3 days. Rash is concentrated on the torso and limbs, appearing as red papules with intense itching.',
  imageUrl:
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1000&auto=format&fit=crop',
  userFullName: 'John Doe',
  medicineName: 'Amoxicillin',
  medicinePresentation: '500mg Capsule',
  medicineDosageForm: 'Oral',
  hospitalName: 'City General Hospital',
};

export const Default: Story = {
  args: {
    data: mockReport,
    onAccept: (report) => console.log('Accepted:', report),
    onReject: (report) => console.log('Rejected:', report),
  },
};

export const MinimalData: Story = {
  args: {
    data: {
      ...mockReport,
      hospitalName: 'City General Hospital',
      medicinePresentation: '500mg Capsule',
      medicineDosageForm: 'Oral',
      description: 'Very short description.',
    },
  },
};

export const LongDescription: Story = {
  args: {
    data: {
      ...mockReport,
      description:
        'This is a very long description to test the line-clamp behavior of the card. The patient has been experiencing multiple symptoms including nausea, dizziness, and a persistent cough that does not resolve with standard treatment. Furthermore, the patient has a history of allergies to several sulfonamides and has previously reported similar reactions to other penicillin-class antibiotics in 2018.',
    },
  },
};
