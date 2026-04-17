import { Search } from "lucide-react";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";

interface InputFieldProps {
  variant: "text" | "password" | "search" | "email";
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

const variantDefaults: Record<
  InputFieldProps["variant"],
  { label: string; placeholder: string; description: string }
> = {
  text: {
    label: "Text",
    placeholder: "Enter text...",
    description: "Plain text input.",
  },
  password: {
    label: "Password",
    placeholder: "Enter password...",
    description: "Your password is kept secure.",
  },
  search: {
    label: "Search",
    placeholder: "Search...",
    description: "Search for anything.",
  },
  email: {
    label: "Email",
    placeholder: "you@example.com",
    description: "We'll never share your email.",
  },
};

const InputField = ({
  variant,
  label,
  placeholder,
  description,
  disabled,
}: InputFieldProps) => {
  const defaults = variantDefaults[variant];

  return (
    <Field>
      <FieldLabel>{label ?? defaults.label}</FieldLabel>
      <FieldDescription>{description ?? defaults.description}</FieldDescription>

      {variant === "search" ? (
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={placeholder ?? defaults.placeholder}
            disabled={disabled}
            className="pl-8"
          />
        </div>
      ) : (
        <Input
          type={variant}
          placeholder={placeholder ?? defaults.placeholder}
          disabled={disabled}
        />
      )}
    </Field>
  );
};

export default InputField;
