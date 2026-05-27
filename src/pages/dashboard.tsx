import { TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';
import Navbar from '@/components/Global/navbar';
import { Footer } from '@/components/Global/footer';
import { MetricCard } from '@/components/MetricCards/metric-card';
import StockFileUpload from '@/components/StockFileUpload/StockFileUpload';
import { ChoroplethMap } from '@/components/ChoroplethMap/ChoroplethMap';
import { HospitalSelector } from '@/components/HospitalSelector/hospitalSelector';
import { PeriodStockReportGraph } from '@/components/PeriodStockReportGraph/PeriodStockReportGraph';
import { PeriodStockReportGraphWithStock } from '@/components/PeriodStockReportGraphWithStock/PeriodStockReportGraphWithStock';
import {
  getMonthlyReports,
  getStockAvgs,
  getStockReport,
  type MonthlyReports,
  type StockAverages,
  type StockReport,
} from '@/services/dashboard/kpis';
import { getCriticalMedicines } from '@/services/hospitals/hospitalsService';
import type { HospitalCriticalMedicinesResponse } from '@/common/CriticalMedicineData';
import { CriticalMedicineCard } from '@/components/CriticalMedicineCard/critical-medicine-card';
import { useHospitals } from '@/hooks/useHospitals';
import { useEffect, useState } from 'react';
import {
  getStateSupplyHeatmap,
  type StateSupplyData,
} from '@/services/dashboard/stateSupply';

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
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReports | null>(
    null
  );
  const [stateSupply, setStateSupply] = useState<StateSupplyData[]>([]);

  useEffect(() => {
    getStateSupplyHeatmap()
      .then(setStateSupply)
      .catch((err) => console.log('Error al obtener mapa de abasto:', err));
  }, []);

  useEffect(() => {
    if (!selectedHospital) return;

    getStockAvgs(Number(selectedHospital.id))
      .then(setStockAvgs)
      .catch((err) =>
        console.log('Error al obtener el abasto promedio: ', err)
      );

    getStockReport(Number(selectedHospital.id))
      .then(setStockReport)
      .catch((err) =>
        console.log('Error al obtener los medicamentos en desabasto: ', err)
      );


    getCriticalMedicines(Number(selectedHospital.id))
      .then(setCriticalMedicines)
      .catch((err) =>
        console.log('Error al obtener medicamentos críticos:', err)
      );
    getMonthlyReports(Number(selectedHospital.id))
      .then(setMonthlyReports)
      .catch((err) =>
        console.log('Error al obtener el numero de reportes mensuales: ', err)
      );

    return () => {
      setStockAvgs(null);
      setStockReport(null);
      setCriticalMedicines([]);
      setMonthlyReports(null);
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
            value={monthlyReports?.currentMonthReportCount.toString() || '---'}
            icon={<BarChart2 className="size-5" />}
            trend={
              'Tendencia: ' +
              (Number(monthlyReports?.comparisonToLastMonth) > 0
                ? 'Incremental (+'
                : 'Decremental (-') +
              `${monthlyReports?.comparisonToLastMonth}%)`
            }
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
              <div className="px-5 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">
                  Nivel de Abasto por Entidad Federativa
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pasa el cursor sobre un estado para ver el detalle
                </p>
              </div>
              <ChoroplethMap data={stateSupply} height="340px" />
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
