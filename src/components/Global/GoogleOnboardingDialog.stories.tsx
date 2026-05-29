import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthProvider } from '@/contexts/AuthContext';
import GoogleOnboardingDialog from './GoogleOnboardingDialog';

const meta = {
  component: GoogleOnboardingDialog,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof GoogleOnboardingDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onComplete: () => console.log('completed'),
  },
};
