import type { Meta, StoryObj } from '@storybook/react-vite'
import ReportCard from './reportCard'

const meta: Meta<typeof ReportCard> = {
  component: ReportCard,
  argTypes: {
    fileUploadError: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ReportCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fileUploadError: false,
  },
}

export const WithFileUploadError: Story = {
  args: {
    fileUploadError: true,
  },
}
