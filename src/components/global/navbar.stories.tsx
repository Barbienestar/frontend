import type { Meta, StoryObj } from '@storybook/react-vite'
import Navbar from './navbar'

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'admin', 'gobierno'],
    },
    activePath: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    activePath: '/inicio',
  },
}

export const DefaultReportarActive: Story = {
  args: {
    variant: 'default',
    activePath: '/reportar',
  },
}

export const DefaultMapaActive: Story = {
  args: {
    variant: 'default',
    activePath: '/mapa-de-abasto',
  },
}

export const Admin: Story = {
  args: {
    variant: 'admin',
  },
}

export const Gobierno: Story = {
  args: {
    variant: 'gobierno',
  },
}
