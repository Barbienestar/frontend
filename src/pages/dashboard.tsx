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
import type {
  CriticalMedicine,
  HospitalCriticalMedicinesResponse,
} from '@/common/CriticalMedicineData';
import { CriticalMedicineCard } from '@/components/CriticalMedicineCard/critical-medicine-card';
import { useHospitals } from '@/hooks/useHospitals';
import { useEffect, useState } from 'react';
import {
  getStateSupplyHeatmap,
  type StateSupplyData,
} from '@/services/dashboard/stateSupply';

// Imports needed for the ShadCN / date-fns Date Pickers
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DashboardPage = () => {
  const {
    hospitals,
    selectedHospital,
    setSelectedHospital,
    loading: loadingHospitals,
  } = useHospitals();

  // Date selection states moved up from individual components to control KPIs globally
  const [startDate, setStartDate] = useState<Date | undefined>(
    subMonths(new Date(), 1)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const [stockAvgs, setStockAvgs] = useState<StockAverages | null>(null);
  const [stockReport, setStockReport] = useState<StockReport | null>(null);
  const [criticalMedicines, setCriticalMedicines] =
    useState<HospitalCriticalMedicinesResponse | null>(null);
  const [criticalMedicinesPage, setCriticalMedicinesPage] = useState(0);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReports | null>(
    null
  );
  const [stateSupply, setStateSupply] = useState<StateSupplyData[]>([]);

  // Initial fetch for state map data
  useEffect(() => {
    getStateSupplyHeatmap()
      .then(setStateSupply)
      .catch((err) => console.log('Error al obtener mapa de abasto:', err));
  }, []);

  // Fetch critical medicines only when hospital or page selection transitions
  useEffect(() => {
    if (!selectedHospital) return;

    getCriticalMedicines(Number(selectedHospital.id), criticalMedicinesPage)
      .then(setCriticalMedicines)
      .catch((err) =>
        console.log('Error al obtener medicamentos críticos:', err)
      );
  }, [selectedHospital, criticalMedicinesPage]);

  // Fetch standard KPI values when hospital or chosen dates alter
  useEffect(() => {
    if (!selectedHospital || !startDate || !endDate) return;

    const formattedStart = format(startDate, 'yyyy-MM-dd');
    const formattedEnd = format(endDate, 'yyyy-MM-dd');

    const dateRangePayload = {
      firstDate: formattedStart,
      secondDate: formattedEnd,
    };

    getStockAvgs(Number(selectedHospital.id), dateRangePayload)
      .then(setStockAvgs)
      .catch((err) =>
        console.log('Error al obtener el abasto promedio: ', err)
      );

    getStockReport(Number(selectedHospital.id), dateRangePayload)
      .then(setStockReport)
      .catch((err) =>
        console.log('Error al obtener los medicamentos en desabasto: ', err)
      );

    getMonthlyReports(Number(selectedHospital.id), dateRangePayload)
      .then(setMonthlyReports)
      .catch((err) =>
        console.log('Error al obtener el numero de reportes mensuales: ', err)
      );

    return () => {
      setStockAvgs(null);
      setStockReport(null);
      setMonthlyReports(null);
    };
  }, [selectedHospital, startDate, endDate]);

  const renderStockValue = () => {
    if (stockAvgs?.currentMonthAvg != null) {
      return `${stockAvgs.currentMonthAvg.toFixed(1)} %`;
    }
    return '---';
  };

  const renderStockDifference = () => {
    if (stockAvgs?.currentMonthAvg != null && stockAvgs?.lastMonthAvg != null) {
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
      <Navbar variant="gobierno" activePath="/dashboard" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Análisis de Disponibilidad de Medicamentos
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitoreo estratégico y detección de discrepancias en el
                suministro nacional.
              </p>
            </div>

            {/* Control Element: Selectors Wrapper Container */}
            <div className="flex flex-wrap items-center gap-2 md:self-end">
              {(['start', 'end'] as const).map((which) => {
                const date = which === 'start' ? startDate : endDate;
                const setDate = which === 'start' ? setStartDate : setEndDate;
                return (
                  <Popover key={which}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start min-w-[120px] text-xs h-9 bg-card"
                      >
                        {date
                          ? format(date, 'd MMM, yyyy', { locale: es })
                          : which === 'start'
                            ? 'Fecha inicio'
                            : 'Fecha fin'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                );
              })}

              <span className="text-muted-foreground/30 hidden sm:block mx-1">
                ·
              </span>

              <HospitalSelector
                hospitals={hospitals}
                selected={selectedHospital}
                onSelect={(hospital) => {
                  setSelectedHospital(hospital);
                  setCriticalMedicinesPage(0);
                  setCriticalMedicines(null); // Clear previous UI instantly on change
                }}
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
            trend={`${renderStockDifference()} vs. periodo anterior`}
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
            label="Reportes del Periodo"
            value={monthlyReports?.currentMonthReportCount.toString() || '---'}
            icon={<BarChart2 className="size-5" />}
            trend={(() => {
              if (
                !monthlyReports ||
                monthlyReports.comparisonToLastMonth == null
              ) {
                return 'Tendencia: ---';
              }

              const trendValue = monthlyReports.comparisonToLastMonth * 100;
              const isIncremental = trendValue > 0;

              return `Tendencia: ${isIncremental ? 'Incremental (+' : 'Decremental ('}${trendValue.toFixed(1)}%)`;
            })()}
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
              <h2 className="font-semibold text-foreground mb-4">
                Medicamentos Críticos
              </h2>
              <div className="flex flex-col gap-3">
                {criticalMedicines &&
                criticalMedicines.criticalMedicines.length > 0 ? (
                  criticalMedicines.criticalMedicines.map(
                    (med: CriticalMedicine) => (
                      <CriticalMedicineCard
                        key={med.id}
                        hospitalName={criticalMedicines.hospitalName}
                        medicineName={med.genericName}
                        stock={med.stock}
                      />
                    )
                  )
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No hay medicamentos críticos para este hospital.
                  </p>
                )}
              </div>

              {criticalMedicines && criticalMedicines.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => setCriticalMedicinesPage((p) => p - 1)}
                    disabled={criticalMedicinesPage === 0}
                    className="text-xs text-primary hover:underline disabled:opacity-40 disabled:pointer-events-none"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {criticalMedicinesPage + 1} / {criticalMedicines.totalPages}
                  </span>
                  <button
                    onClick={() => setCriticalMedicinesPage((p) => p + 1)}
                    disabled={
                      criticalMedicinesPage >= criticalMedicines.totalPages - 1
                    }
                    className="text-xs text-primary hover:underline disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer variant="full" />
    </div>
  );
};

export default DashboardPage;
