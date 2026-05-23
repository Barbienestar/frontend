import type { Meta, StoryObj } from '@storybook/react-vite';
import { HospitalSelector } from './hospitalSelector';

const hospitalsMock = [
  {
    id: 1,
    name: 'Hospital San José',
  },
  {
    id: 2,
    name: 'Hospital Ángeles',
  },
  {
    id: 3,
    name: 'Hospital General',
  },
];

const meta: Meta<typeof HospitalSelector> = {
  title: 'Components/HospitalSelector',
  component: HospitalSelector,
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: 'object',
    },
    hospitals: {
      control: 'object',
    },
    onSelect: {
      action: 'hospital-selected',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof HospitalSelector>;

export const Default: Story = {
  args: {
    hospitals: hospitalsMock,
    selected: null,
    loading: false,
  },
};

export const WithSelectedHospital: Story = {
  args: {
    hospitals: hospitalsMock,
    selected: hospitalsMock[1],
    loading: false,
  },
};

export const Empty: Story = {
  args: {
    hospitals: [],
    selected: null,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    hospitals: [],
    selected: null,
    loading: true,
  },
};
