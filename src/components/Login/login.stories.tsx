// src/components/Login/login.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Login } from './login';

const meta = {
  component: Login,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (email, password) => {
      console.log('Submit:', { email, password });
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
