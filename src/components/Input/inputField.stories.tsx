import type { Meta, StoryObj } from "@storybook/react-vite";
import InputField from "./inputField";

const meta: Meta<typeof InputField> = {
  component: InputField,
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "password", "search", "email", "select"],
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

export const Select: Story = {
  args: {
    variant: "select",
    label: "Hospital o Clínica",
    placeholder: "Seleccione una unidad médica",
    description: "Elige el hospital o clínica donde ocurrió el desabasto.",
    options: [
      { value: "imss-1", label: "IMSS — Hospital General de Zona #1" },
      { value: "issste-1", label: "ISSSTE — Clínica Hospital" },
      { value: "ssa-1", label: "SSA — Centro de Salud" },
    ],
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
