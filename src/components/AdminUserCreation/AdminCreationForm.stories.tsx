import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdminCreationForm } from './AdminCreationForm';

const meta = {
  component: AdminCreationForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AdminCreationForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
