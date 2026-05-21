import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { EmptySearchCTA } from './emptySearchCTA';

const meta: Meta<typeof EmptySearchCTA> = {
  title: 'Components/EmptySearchCTA',
  component: EmptySearchCTA,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-6 bg-background min-h-screen">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof EmptySearchCTA>;

export const Default: Story = {};
