import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer-v3";

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

      {variant === "heatmap" && (
        <HeatmapLayer
          points={points}
          latitudeExtractor={(p) => p.lat}
          longitudeExtractor={(p) => p.lng}
          intensityExtractor={(p) => p.intensity ?? 1}
          radius={35}
          blur={20}
          max={1}
          gradient={{ 0.3: "#3b82f6", 0.6: "#f59e0b", 1: "#ef4444" }}
        />
      )}

      {variant === "normal" &&
        points.map((point, i) => (
          <Marker key={i} position={[point.lat, point.lng]}>
            {point.name && <Popup>{point.name}</Popup>}
          </Marker>
        ))}
    </MapContainer>
  );
}
