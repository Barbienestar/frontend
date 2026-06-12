import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '@/contexts/AuthContext';
import Navbar from './navbar';

const mockAuthValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {
    throw new Error('not implemented');
  },
  signInWithGoogle: async () => {
    throw new Error('not implemented');
  },
  signOut: async () => {},
  hasRole: () => false,
  setUser: () => {},
};

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <Story />
        </AuthContext.Provider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'admin', 'gobierno'],
    },
    activePath: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    activePath: '/inicio',
  },
};

export const DefaultReportarActive: Story = {
  args: {
    variant: 'default',
    activePath: '/reportar',
  },
};

export const DefaultMapaActive: Story = {
  args: {
    variant: 'default',
    activePath: '/mapa-de-abasto',
  },
};

export const Admin: Story = {
  args: {
    variant: 'admin',
  },
};

export const Gobierno: Story = {
  args: {
    variant: 'gobierno',
  },
};
