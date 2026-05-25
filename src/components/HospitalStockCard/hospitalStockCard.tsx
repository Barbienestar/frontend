import { MapPin, Navigation } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { Button } from '@/components/Button/button';
import type { StockData } from '@/common/StockData';

interface HospitalStockCardProps {
  data: StockData;
  medicineName: string;
  selected?: boolean;
  onClick?: () => void;
}

const borderColors = {
  Disponible: 'border-l-green-500',
  Limitado: 'border-l-yellow-500',
  Agotado: 'border-l-red-500',
};

const stockLabelColors = {
  Disponible: 'text-green-600',
  Limitado: 'text-yellow-600',
  Agotado: 'text-red-500',
};

const HospitalStockCard = ({
  data,
  medicineName,
  selected = false,
  onClick,
}: HospitalStockCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl border border-border border-l-4 bg-card p-4 cursor-pointer
        transition-all flex flex-col gap-3
        ${borderColors[data.status]}
        ${selected ? 'shadow-md ring-1 ring-primary' : 'hover:shadow-sm'}
      `}
    >
      {/* Row 1: badge + stock label */}
      <div className="flex items-center gap-3">
        <StatusBadge variant={data.status} />
        <span
          className={`text-sm font-semibold ${stockLabelColors[data.status]}`}
        >
          {data.stockLabel}
        </span>
      </div>

      {/* Row 2: nombre + dirección */}
      <div className="flex flex-col gap-0.5">
        <p className="font-bold text-sm text-foreground leading-snug">
          {data.hospitalName}
        </p>
        <p className="text-xs text-muted-foreground">{data.address}</p>
      </div>

      {/* Row 3: medicina + botón */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{medicineName}</span>
        {data.mapsUrl ? (
          <Button variant="default" size="sm" className="shrink-0">
            <Navigation className="size-3.5" />
            Cómo llegar
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span>Ubicación no disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalStockCard;
