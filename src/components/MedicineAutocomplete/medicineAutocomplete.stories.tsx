import type { Meta, StoryObj } from '@storybook/react';
import MedicineAutocomplete from './medicineAutocomplete';

const meta = {
  title: 'Components/MedicineAutocomplete',
  component: MedicineAutocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    onSelect: () => {},
    onSearch: () => {},
  },
} satisfies Meta<typeof MedicineAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};