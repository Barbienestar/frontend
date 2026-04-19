import { Map } from "@/components/Map/map";
import type { MedicinePoint } from "@/components/Map/map";

const mockMexicoPoints: MedicinePoint[] = [
  { lat: 16.75, lng: -93.1, intensity: 0.85, name: "Chiapas" },
  { lat: 17.06, lng: -96.72, intensity: 0.7, name: "Oaxaca" },
  { lat: 16.97, lng: -99.66, intensity: 0.6, name: "Guerrero" },
  { lat: 18.0, lng: -94.05, intensity: 0.5, name: "Veracruz" },
  { lat: 19.43, lng: -99.13, intensity: 0.9, name: "Ciudad de México" },
  { lat: 20.97, lng: -89.62, intensity: 0.4, name: "Yucatán" },
  { lat: 21.88, lng: -102.28, intensity: 0.65, name: "Aguascalientes" },
  { lat: 20.67, lng: -103.35, intensity: 0.75, name: "Jalisco" },
  { lat: 25.67, lng: -100.31, intensity: 0.55, name: "Nuevo León" },
  { lat: 28.63, lng: -106.07, intensity: 0.45, name: "Chihuahua" },
  { lat: 29.07, lng: -110.96, intensity: 0.3, name: "Sonora" },
  { lat: 24.8, lng: -107.39, intensity: 0.5, name: "Sinaloa" },
  { lat: 19.7, lng: -101.18, intensity: 0.8, name: "Michoacán" },
  { lat: 22.15, lng: -100.98, intensity: 0.6, name: "San Luis Potosí" },
  { lat: 20.59, lng: -100.39, intensity: 0.7, name: "Querétaro" },
];

export function MapaPage() {
  return (
    <div className="min-h-svh bg-background p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Intensidad de Desabasto por Entidad Federativa
      </h1>
      <Map
        variant="heatmap"
        points={mockMexicoPoints}
        center={[23.6345, -102.5528]}
        zoom={5}
        height="520px"
      />
    </div>
  );
}
