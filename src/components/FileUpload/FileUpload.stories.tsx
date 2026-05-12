import type { Meta, StoryObj } from '@storybook/react-vite';
import FileUpload from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  argTypes: {
    variant: {
      control: 'select',
      options: ['receta', 'csv'],
    },
    error: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Receta: Story = {
  args: {
    variant: 'receta',
    error: false,
  },
};

export const RecetaError: Story = {
  args: {
    variant: 'receta',
    error: true,
  },
};

export const Csv: Story = {
  args: {
    variant: 'csv',
    error: false,
  },
};

export const CsvError: Story = {
  args: {
    variant: 'csv',
    error: true,
  },
};
