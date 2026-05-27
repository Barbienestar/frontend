import { TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';
import Navbar from '@/components/Global/navbar';
import { Footer } from '@/components/Global/footer';
import { MetricCard } from '@/components/MetricCards/metric-card';
import StockFileUpload from '@/components/StockFileUpload/StockFileUpload';
import { Map } from '@/components/Map/map';
import { HospitalSelector } from '@/components/HospitalSelector/hospitalSelector';
import { PeriodStockReportGraph } from '@/components/PeriodStockReportGraph/PeriodStockReportGraph';
import { PeriodStockReportGraphWithStock } from '@/components/PeriodStockReportGraphWithStock/PeriodStockReportGraphWithStock';
import {
  getStockAvgs,
  getStockReport,
  type StockAverages,
  type StockReport,
} from '@/services/dashboard/kpis';
import { getCriticalMedicines } from '@/services/hospitals/hospitalsService';
import type { HospitalCriticalMedicinesResponse } from '@/common/CriticalMedicineData';
import { CriticalMedicineCard } from '@/components/CriticalMedicineCard/critical-medicine-card';
import { useHospitals } from '@/hooks/useHospitals';
import { useEffect, useState } from 'react';

const heatPoints = [
  { lat: 16.75, lng: -93.1, intensity: 0.95, name: 'Chiapas' },
  { lat: 17.0, lng: -96.7, intensity: 0.85, name: 'Oaxaca' },
  { lat: 18.0, lng: -92.9, intensity: 0.75, name: 'Tabasco' },
  { lat: 20.66, lng: -103.35, intensity: 0.6, name: 'Jalisco' },
  { lat: 19.43, lng: -99.13, intensity: 0.55, name: 'CDMX' },
  { lat: 25.67, lng: -100.3, intensity: 0.4, name: 'Nuevo León' },
  { lat: 29.07, lng: -110.95, intensity: 0.3, name: 'Sonora' },
  { lat: 28.63, lng: -106.08, intensity: 0.35, name: 'Chihuahua' },
];

const DashboardPage = () => {
  const {
    hospitals,
    selectedHospital,
    setSelectedHospital,
    loading: loadingHospitals,
  } = useHospitals();

  const [stockAvgs, setStockAvgs] = useState<StockAverages | null>(null);
  const [stockReport, setStockReport] = useState<StockReport | null>(null);
  const [criticalMedicines, setCriticalMedicines] = useState<
    HospitalCriticalMedicinesResponse[]
  >([]);

  useEffect(() => {
    if (!selectedHospital) return;

    getStockAvgs(Number(selectedHospital.id))
      .then(setStockAvgs)
      .catch((err) => console.log('Error al obtener el abasto promedio:', err));

    getStockReport(Number(selectedHospital.id))
      .then(setStockReport)
      .catch((err) =>
        console.log('Error al obtener los medicamentos en desabasto:', err)
      );

    getCriticalMedicines(Number(selectedHospital.id))
      .then(setCriticalMedicines)
      .catch((err) =>
        console.log('Error al obtener medicamentos críticos:', err)
      );

    return () => {
      setStockAvgs(null);
      setStockReport(null);
      setCriticalMedicines([]);
    };
  }, [selectedHospital]);

  const renderStockValue = () => {
    if (stockAvgs != null && stockAvgs.currentMonthAvg != null) {
      return `${stockAvgs.currentMonthAvg.toFixed(1)} %`;
    }
    return '---';
  };

  const renderStockDifference = () => {
    if (
      stockAvgs != null &&
      stockAvgs.currentMonthAvg != null &&
      stockAvgs.lastMonthAvg != null
    ) {
      const diff = Number(
        (stockAvgs.currentMonthAvg - stockAvgs.lastMonthAvg).toFixed(2)
      );
      return (diff < 0 ? '-' : '+') + `${diff} %`;
    }
    return '---';
  };

  const renderBottomMedicines = (medicines?: string[]) => {
    if (!medicines || medicines.length === 0) return '---';
    return medicines
      .map((med) => {
        const trimmed = med.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      })
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-18">
      <Navbar variant="gobierno" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Análisis de Disponibilidad de Medicamentos
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">
                Monitoreo estratégico y detección de discrepancias en el
                suministro nacional.
              </p>
            </div>
            <span className="text-muted-foreground/30 hidden sm:block">·</span>
            <div className="ml-auto">
              <HospitalSelector
                hospitals={hospitals}
                selected={selectedHospital}
                onSelect={setSelectedHospital}
                loading={loadingHospitals}
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Abasto Promedio"
            value={renderStockValue()}
            icon={<TrendingUp className="size-5" />}
            trend={`${renderStockDifference()} vs. mes anterior`}
            trendHighlight="+2.1%"
            variant="approved"
          />
          <MetricCard
            label="Medicamentos en Desabasto"
            value={stockReport?.lowStockCount?.toString() || '---'}
            icon={<AlertTriangle className="size-5" />}
            trend={`Principales: ${renderBottomMedicines(stockReport?.bottomMedicines)}`}
            variant="rejected"
          />
          <MetricCard
            label="Demanda Mensual"
            value="1.2M"
            icon={<BarChart2 className="size-5" />}
            trend="Tendencia: Incremental (+15%)"
            trendHighlight="+15%"
            variant="pending"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Mapa */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">
                  Intensidad de Desabasto por Entidad Federativa
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-blue-500 inline-block" />
                    Óptimo
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-amber-400 inline-block" />
                    Regular
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-red-500 inline-block" />
                    Crítico
                  </span>
                </div>
              </div>
              <Map
                variant="heatmap"
                points={heatPoints}
                center={[23.6, -102.5]}
                zoom={5}
                height="340px"
              />
            </div>

            <PeriodStockReportGraphWithStock
              hospitalId={
                selectedHospital ? Number(selectedHospital.id) : undefined
              }
            />

            <PeriodStockReportGraph
              hospitalId={
                selectedHospital ? Number(selectedHospital.id) : undefined
              }
            />
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Carga de datos */}
            <StockFileUpload
              hospitalId={
                selectedHospital ? Number(selectedHospital.id) : undefined
              }
              hospitalName={selectedHospital?.name}
            />

            {/* Medicamentos críticos */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">
                  Medicamentos Críticos
                </h2>
                <button className="text-xs text-primary hover:underline">
                  Ver todos
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {criticalMedicines.flatMap((hospital) =>
                  hospital.criticalMedicines.map((med) => (
                    <CriticalMedicineCard
                      key={med.id}
                      hospitalName={hospital.hospitalName}
                      medicineName={med.genericName}
                      stock={med.stock}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="full" />
    </div>
  );
};

export default DashboardPage;
