import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label?: ReactNode;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  labelClassName?: string;
  descClassName?: string;
  error?: boolean;
}

export function SearchableSelect({
  label,
  placeholder = 'Buscar...',
  description,
  options,
  value,
  onChange,
  disabled,
  labelClassName,
  descClassName,
  error,
}: SearchableSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const filtered =
    query.trim().length > 0
      ? options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase().trim())
        )
      : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setQuery('');
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
    setQuery('');
  };

  return (
    <Field>
      {label && <FieldLabel className={cn(labelClassName)}>{label}</FieldLabel>}

      <div ref={wrapperRef} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          disabled={disabled}
          value={open ? query : selectedLabel}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={open ? 'Buscar...' : placeholder}
          className={cn(
            'w-full pl-8 pr-3 py-2 rounded-md border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-destructive focus:ring-destructive'
              : 'border-input focus:ring-ring'
          )}
        />

        {open && (
          <ul className="absolute top-full left-0 right-0 z-10002 mt-1 bg-card border border-border rounded-md shadow-lg max-h-52 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  onMouseDown={() => handleSelect(opt)}
                  className={cn(
                    'px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors',
                    opt.value === value && 'font-medium text-primary'
                  )}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                Sin resultados
              </li>
            )}
          </ul>
        )}
      </div>

      {description && (
        <FieldDescription className={cn(descClassName)}>
          {description}
        </FieldDescription>
      )}
    </Field>
  );
}
