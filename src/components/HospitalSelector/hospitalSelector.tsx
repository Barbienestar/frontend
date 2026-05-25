import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import type { HospitalData } from '@/common/HospitalData';

interface Props {
  hospitals: HospitalData[];
  selected: HospitalData | null;
  onSelect: (hospital: HospitalData) => void;
  loading?: boolean;
}

export function HospitalSelector({
  hospitals,
  selected,
  onSelect,
  loading,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) {
    return <div className="h-8 w-52 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-start gap-2 px-4 py-2 rounded-2xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground shadow-sm"
      >
        <Building2 className="size-4 text-primary" />
        <span className="max-w-[260px] whitespace-normal wrap-break-words text-left">
          {selected?.name ?? 'Seleccionar hospital'}
        </span>
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          <p className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            Mis hospitales
          </p>
          <ul className="py-1 max-h-64 overflow-y-auto">
            {hospitals.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => {
                    onSelect(h);
                    setOpen(false);
                  }}
                  className="w-full flex items-start justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                >
                  <p className="font-medium text-foreground whitespace-normal wrap-break-words">
                    {h.name}
                  </p>
                  {selected?.id === h.id && (
                    <Check className="size-4 text-primary shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
