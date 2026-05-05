import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react'
import { StatCard } from './stat-card'

const meta: Meta<typeof StatCard> = {
  component: StatCard,
  title: 'Components/StatCard',
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const AbastoPromedio: Story = {
  args: {
    variant: 'progress',
    label: 'Abasto Promedio',
    value: '74.2%',
    delta: '+2.1%',
    progress: 74.2,
    icon: <TrendingUp className="w-5 h-5 text-green-600" />,
  },
}

export const MedicamentosEnDesabasto: Story = {
  args: {
    variant: 'number',
    label: 'Medicamentos en Desabasto',
    value: '12',
    valueLabel: 'Consultar',
    description: 'Principales: Insulina, Paracetamol 500mg',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
  },
}

export const DemandaMensual: Story = {
  args: {
    variant: 'number',
    label: 'Demanda Mensual',
    value: '1.2M',
    valueLabel: 'Unidades',
    description: 'Tendencia: Incremental (+15%)',
    icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
  },
}

export const AllCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        variant="progress"
        label="Abasto Promedio"
        value="74.2%"
        delta="+2.1%"
        progress={74.2}
        icon={<TrendingUp className="w-5 h-5 text-green-600" />}
      />
      <StatCard
        variant="number"
        label="Medicamentos en Desabasto"
        value="12"
        valueLabel="Consultar"
        description="Principales: Insulina, Paracetamol 500mg"
        icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
      />
      <StatCard
        variant="number"
        label="Demanda Mensual"
        value="1.2M"
        valueLabel="Unidades"
        description="Tendencia: Incremental (+15%)"
        icon={<BarChart2 className="w-5 h-5 text-blue-500" />}
      />
    </div>
  ),
}
