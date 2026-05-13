import { MapPin } from 'lucide-react';
import { Map } from '@/components/Map/map';
import type { MedicinePoint } from '@/components/Map/map';

interface SidebarMapCardProps {
  points?: MedicinePoint[];
  onViewFullMap?: () => void;
}

const defaultPoints: MedicinePoint[] = [
  { lat: 19.4326, lng: -99.1332, name: 'CDMX Centro' },
];

export const SidebarMapCard = ({
  points = defaultPoints,
  onViewFullMap,
}: SidebarMapCardProps) => {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Map
        variant="normal"
        points={points}
        center={[19.4326, -99.1332]}
        zoom={11}
        height="280px"
      />
      <div className="p-3 border-t border-border">
        <button
          onClick={onViewFullMap}
          className="w-full text-sm font-medium text-primary flex items-center justify-center gap-1 hover:underline"
        >
          <MapPin className="size-3.5" />
          Ver Mapa de Abasto
        </button>
      </div>
    </div>
  );
};