import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'lg', 'sm', 'xs'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
    children: 'Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    size: 'default',
    children: 'Button',
  },
}
