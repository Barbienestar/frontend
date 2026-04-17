import type { Meta, StoryObj } from "@storybook/react-vite";
import FileUpload from "./FileUpload";

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  argTypes: {
    variant: {
      control: "select",
      options: ["receta", "csv"],
    },
    text: {
      control: "text",
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Receta: Story = {
  args: {
    variant: "receta",
    text: "Foto de la receta",
  },
};

export const Csv: Story = {
  args: {
    variant: "csv",
    text: "Arrastra tu archivo CSV",
  },
};
