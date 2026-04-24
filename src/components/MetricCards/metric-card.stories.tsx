// src/components/MetricCard/metric-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClipboardList, CircleCheck, CircleX } from 'lucide-react';
import { MetricCard } from './metric-card';
const meta = {
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pendientes: Story = {
  args: {
    label: 'Pendientes',
    value: '124',
    icon: <ClipboardList size={22} />,
    trend: '+12% vs. semana pasada',
    trendHighlight: '+12%',
    variant: 'pending',
    className: 'w-[280px]',
  },
};

export const Aprobados: Story = {
  args: {
    label: 'Aprobados',
    value: '1,450',
    icon: <CircleCheck size={22} />,
    trend: 'Total acumulado mensual',
    variant: 'approved',
    className: 'w-[280px]',
  },
};

export const Rechazados: Story = {
  args: {
    label: 'Rechazados',
    value: '82',
    icon: <CircleX size={22} />,
    trend: '+2.4% Revisiones no válidas',
    trendHighlight: '+2.4%',
    variant: 'rejected',
    className: 'w-[280px]',
  },
};
