import { Search, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Field, FieldLabel, FieldDescription } from '../ui/field';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface InputFieldProps {
  variant: 'text' | 'password' | 'search' | 'email' | 'select';
  name?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  options?: SelectOption[];
  value?: string;
  labelClassName?: string;
  descClassName?: string;
  inputClassName?: string;
  isMedicine?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const variantDefaults: Record <
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

interface MedicineComboboxProps {
  options?: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const MedicineCombobox = ({
  options = [],
  value,
  placeholder,
  disabled,
  onChange,
}: MedicineComboboxProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt: SelectOption) => {
    const fakeEvent = {
      target: { value: opt.value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(fakeEvent);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-left shadow-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8',
          !selected && 'text-muted-foreground'
        )}
      >
        {selected ? selected.label : placeholder}
      </button>
      <ChevronDown
        className={cn(
          'absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-transform',
          open && 'rotate-180'
        )}
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-md max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer leading-snug hover:bg-muted',
                opt.value === value && 'bg-muted font-medium'
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const InputField = ({
  variant,
  name,
  label,
  placeholder,
  description,
  disabled,
  options,
  value,
  labelClassName,
  descClassName,
  inputClassName,
  isMedicine = false,
  onChange,
  onBlur,
}: InputFieldProps) => {
  const defaults = variantDefaults[variant];

  return (
    <Field>
      <FieldLabel className={cn(labelClassName)}>
        {label ?? defaults.label}
      </FieldLabel>

      {variant === 'search' && (
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            name={name}
            placeholder={placeholder ?? defaults.placeholder}
            disabled={disabled}
            className={cn(inputClassName, 'pl-8')}
          />
        </div>
      )}

      {variant === 'select' && isMedicine && (
        <MedicineCombobox
          options={options}
          value={value}
          placeholder={placeholder ?? defaults.placeholder}
          disabled={disabled}
          onChange={onChange}
        />
      )}

      {variant === 'select' && !isMedicine && (
        <div className="relative flex items-center">
          <select
            name={name}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8',
              inputClassName
            )}
          >
            <option value="" disabled>
              {placeholder ?? defaults.placeholder}
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} title={opt.label}>
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
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(inputClassName)}
        />
      )}

      <FieldDescription className={cn(descClassName)}>
        {description ?? defaults.description}
      </FieldDescription>
    </Field>
  );
};

export default InputField;