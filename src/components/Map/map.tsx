import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.heat";

// Fix marker icons with Vite bundler
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MedicinePoint {
  lat: number;
  lng: number;
  intensity?: number;
  name?: string;
}

function HeatLayer({ points }: { points: MedicinePoint[] }) {
  const map = useMap();

  useEffect(() => {
    const heatPoints = points.map(
      (p) => [p.lat, p.lng, p.intensity ?? 1] as [number, number, number]
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heat = (L as any).heatLayer(heatPoints, {
      radius: 35,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.3: "#3b82f6", 0.6: "#f59e0b", 1: "#ef4444" },
    });

    heat.addTo(map);
    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export interface MapProps {
  variant: "heatmap" | "normal";
  points: MedicinePoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function Map({
  variant,
  points,
  center,
  zoom = 14,
  height = "480px",
}: MapProps) {
  const defaultCenter: [number, number] = center ?? [
    points.reduce((acc, p) => acc + p.lat, 0) / points.length,
    points.reduce((acc, p) => acc + p.lng, 0) / points.length,
  ];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {variant === "heatmap" && <HeatLayer points={points} />}

      {variant === "normal" &&
        points.map((point, i) => (
          <Marker key={i} position={[point.lat, point.lng]}>
            {point.name && <Popup>{point.name}</Popup>}
          </Marker>
        ))}
    </MapContainer>
  );
}
