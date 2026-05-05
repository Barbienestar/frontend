import { Map } from '@/components/Map/map'
import type { MedicinePoint } from '@/components/Map/map'
import Navbar from '@/components/global/navbar'
import { StatCard } from '@/components/StatCard/stat-card'
import { TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react'

const mockMexicoPoints: MedicinePoint[] = [
  { lat: 16.75, lng: -93.1, intensity: 0.85, name: 'Chiapas' },
  { lat: 17.06, lng: -96.72, intensity: 0.7, name: 'Oaxaca' },
  { lat: 16.97, lng: -99.66, intensity: 0.6, name: 'Guerrero' },
  { lat: 18.0, lng: -94.05, intensity: 0.5, name: 'Veracruz' },
  { lat: 19.43, lng: -99.13, intensity: 0.9, name: 'Ciudad de México' },
  { lat: 20.97, lng: -89.62, intensity: 0.4, name: 'Yucatán' },
  { lat: 21.88, lng: -102.28, intensity: 0.65, name: 'Aguascalientes' },
  { lat: 20.67, lng: -103.35, intensity: 0.75, name: 'Jalisco' },
  { lat: 25.67, lng: -100.31, intensity: 0.55, name: 'Nuevo León' },
  { lat: 28.63, lng: -106.07, intensity: 0.45, name: 'Chihuahua' },
  { lat: 29.07, lng: -110.96, intensity: 0.3, name: 'Sonora' },
  { lat: 24.8, lng: -107.39, intensity: 0.5, name: 'Sinaloa' },
  { lat: 19.7, lng: -101.18, intensity: 0.8, name: 'Michoacán' },
  { lat: 22.15, lng: -100.98, intensity: 0.6, name: 'San Luis Potosí' },
  { lat: 20.59, lng: -100.39, intensity: 0.7, name: 'Querétaro' },
]

export function MapaPage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar variant="gobierno" activePath="/mapa" />

      <div className="px-8 py-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Análisis de Disponibilidad de Medicamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitoreo estratégico y detección de discrepancias en el suministro nacional.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            variant="progress"
            label="Abasto Promedio"
            value="74.2%"
            delta="+2.1%"
            progress={74.2}
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          />
          <StatCard
            variant="number"
            label="Medicamentos en Desabasto"
            value="12"
            valueLabel="Consultar"
            description="Principales: Insulina, Paracetamol 500mg"
            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            variant="number"
            label="Demanda Mensual"
            value="1.2M"
            valueLabel="Unidades"
            description="Tendencia: Incremental (+15%)"
            icon={<BarChart2 className="w-5 h-5 text-blue-500" />}
          />
        </div>

        {/* Map section */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Intensidad de Desabasto por Entidad Federativa
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                Óptimo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Regular
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Crítico
              </span>
            </div>
          </div>
          <Map
            variant="heatmap"
            points={mockMexicoPoints}
            center={[23.6345, -102.5528]}
            zoom={5}
            height="520px"
          />
        </div>
      </div>
    </div>
  )
}
