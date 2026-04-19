import type { Meta, StoryObj } from '@storybook/react-vite'
import StatusBadge from './StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  component: StatusBadge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['Disponible', 'Limitado', 'Agotado'],
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Disponible: Story = {
  args: {
    variant: 'Disponible',
  },
}

export const Limitado: Story = {
  args: {
    variant: 'Limitado',
  },
}

export const Agotado: Story = {
  args: {
    variant: 'Agotado',
  },
}
