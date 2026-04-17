import type { Meta, StoryObj } from "@storybook/react-vite";
import InputField from "./inputField";

const meta: Meta<typeof InputField> = {
  component: InputField,
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "password", "search", "email"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: "text",
  },
};

export const Password: Story = {
  args: {
    variant: "password",
  },
};

export const Search: Story = {
  args: {
    variant: "search",
  },
};

export const Email: Story = {
  args: {
    variant: "email",
  },
};

export const Disabled: Story = {
  args: {
    variant: "text",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <InputField variant="text" />
      <InputField variant="email" />
      <InputField variant="password" />
      <InputField variant="search" />
    </div>
  ),
};
