import type { Meta, StoryObj } from '@storybook/react-vite';
import Footer from './footer';

const meta: Meta<typeof Footer> = {
  component: Footer,
  argTypes: {
    variant: {
      control: 'select',
      options: ['full', 'minimal'],
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    variant: 'full',
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
  },
};
