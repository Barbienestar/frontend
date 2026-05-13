import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/inicio' },
      { label: 'Reportar Desabasto' },
    ],
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/inicio' },
      { label: 'Reportes', href: '/reportes' },
      { label: 'Detalle del Reporte' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Inicio' }],
  },
};