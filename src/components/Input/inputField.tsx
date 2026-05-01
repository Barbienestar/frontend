import { Search, ChevronDown } from 'lucide-react';
import { Field, FieldLabel, FieldDescription } from '../ui/field';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface InputFieldProps {
  variant: 'text' | 'password' | 'search' | 'email' | 'select';
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  options?: SelectOption[];
  value?: string;
  labelClassName?: string;
  descClassName?: string;
  inputClassName?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
}

const variantDefaults: Record<
  InputFieldProps['variant'],
  { label: string; placeholder: string; description: string }
> = {
  text: {
    label: 'Text',
    placeholder: 'Enter text...',
    description: 'Plain text input.',
  },
  password: {
    label: 'Password',
    placeholder: 'Enter password...',
    description: 'Your password is kept secure.',
  },
  search: {
    label: 'Search',
    placeholder: 'Search...',
    description: 'Search for anything.',
  },
  email: {
    label: 'Email',
    placeholder: 'you@example.com',
    description: "We'll never share your email.",
  },
  select: {
    label: 'Select',
    placeholder: 'Choose an option...',
    description: 'Select from available options.',
  },
};

const InputField = ({
  variant,
  label,
  placeholder,
  description,
  disabled,
  options,
  value,
  labelClassName,
  descClassName,
  inputClassName,
  onChange,
  onBlur,
}: InputFieldProps) => {
  const defaults = variantDefaults[variant];

  return (
    <Field>
      <FieldLabel className={cn(labelClassName)}>{label ?? defaults.label}</FieldLabel>
      <FieldDescription className={cn(descClassName)}>{description ?? defaults.description}</FieldDescription>

      {variant === 'search' && (
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={placeholder ?? defaults.placeholder}
            disabled={disabled}
            className={cn(inputClassName, "pl-8")}
          />
        </div>
      )}

      {variant === 'select' && (
        <div className="relative flex items-center">
          <select
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            defaultValue=""
            className={cn("w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8", inputClassName)}
          >
            <option value="" disabled>
              {placeholder ?? defaults.placeholder}
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 size-4 text-muted-foreground pointer-events-none" />
        </div>
      )}

      {variant !== 'search' && variant !== 'select' && (
        <Input
          type={variant}
          placeholder={placeholder ?? defaults.placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={cn(inputClassName)}
        />
      )}
    </Field>
  );
};

export default InputField;
