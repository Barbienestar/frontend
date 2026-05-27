import { Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CriticalMedicineCardProps {
  hospitalName: string;
  medicineName: string;
  stock: number;
}

export function CriticalMedicineCard({
  hospitalName,
  medicineName,
  stock,
}: CriticalMedicineCardProps) {
  const isCritical = stock < 50;
  const lineColor = isCritical ? 'bg-red-500' : 'bg-amber-500';
  const stockColor = isCritical ? 'text-red-500' : 'text-amber-500';

  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-1 self-stretch rounded-full', lineColor)} />
      <div className="p-2 rounded-lg bg-muted">
        <Pill className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {medicineName}
        </p>
        <p className="text-xs text-muted-foreground truncate">{hospitalName}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={cn('text-sm font-bold', stockColor)}>{stock} piezas</p>
        <p className="text-xs text-muted-foreground">STOCK</p>
      </div>
    </div>
  );
}
