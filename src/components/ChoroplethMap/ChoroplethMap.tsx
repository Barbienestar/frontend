import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions } from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import type { StateSupplyData } from '@/services/dashboard/stateSupply';

const LEVEL_COLORS: Record<string, string> = {
  'CA-01': '#22c55e',
  'CA-02': '#84cc16',
  'CA-03': '#f59e0b',
  'CA-04': '#ef4444',
};

const LEVEL_LABELS: Record<string, string> = {
  'CA-01': 'Óptimo (≥75%)',
  'CA-02': 'Regular (50-74%)',
  'CA-03': 'Alerta (25-49%)',
  'CA-04': 'Crítico (<25%)',
};

interface ChoroplethMapProps {
  data: StateSupplyData[];
  height?: string;
}

function normalizeStateName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function ChoroplethMap({ data, height = '340px' }: Readonly<ChoroplethMapProps>) {
  const [geojson, setGeojson] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    fetch('/mexico-states.geojson')
      .then((r) => r.json())
      .then(setGeojson)
      .catch(() => console.error('No se pudo cargar el GeoJSON de estados'));
  }, []);

  const dataMap = new Map(
    data.map((d) => [normalizeStateName(d.stateName), d])
  );

  const styleFeature = (feature?: Feature): PathOptions => {
    const name = (feature?.properties as { name?: string })?.name ?? '';
    const stateData = dataMap.get(normalizeStateName(name));
    return {
      fillColor: stateData ? LEVEL_COLORS[stateData.level] : '#94a3b8',
      fillOpacity: 0.75,
      color: '#ffffff',
      weight: 1,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const name = (feature?.properties as { name?: string })?.name ?? '';
    const stateData = dataMap.get(normalizeStateName(name));

    const content = stateData
      ? `<div class="text-sm font-semibold">${name}</div>
         <div class="text-xs">Abasto: <b>${stateData.avgStock.toFixed(1)}%</b></div>
         <div class="text-xs">Nivel: <b>${stateData.level}</b></div>`
      : `<div class="text-sm font-semibold">${name}</div>
         <div class="text-xs text-gray-500">Sin datos</div>`;

    (layer as L.Path).bindTooltip(content, { sticky: true });
  };

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={[23.6, -102.5]}
        zoom={5}
        style={{ height, width: '100%' }}
        zoomControl={true}
        attributionControl={false}
        key="choropleth-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geojson && (
          <GeoJSON
            key={JSON.stringify(data.map((d) => d.level))}
            data={geojson}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs flex flex-col gap-1 shadow">
        {Object.entries(LEVEL_LABELS).map(([level, label]) => (
          <div key={level} className="flex items-center gap-2">
            <span
              className="size-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
            <span className="text-foreground">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-sm inline-block shrink-0 bg-slate-400" />
          <span className="text-muted-foreground">Sin datos</span>
        </div>
      </div>
    </div>
  );
}
