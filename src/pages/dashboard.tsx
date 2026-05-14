import { TrendingUp, AlertTriangle, BarChart2, Pill } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '@/components/Global/navbar';
import { Footer } from '@/components/Global/footer';
import { MetricCard } from '@/components/MetricCards/metric-card';
import StockFileUpload from '@/components/StockFileUpload/StockFileUpload';
import { Map } from '@/components/Map/map';
import type { HospitalData } from '@/common/HospitalData';
import { getStockAvgs, type StockAverages } from '@/services/dashboard/kpis';
import { useEffect, useState } from 'react';

const discrepanciaData = [
  { mes: 'ENE', oficial: 820, reportes: 740 },
  { mes: 'FEB', oficial: 810, reportes: 760 },
  { mes: 'MAR', oficial: 830, reportes: 780 },
  { mes: 'ABR', oficial: 800, reportes: 790 },
  { mes: 'MAY', oficial: 815, reportes: 800 },
  { mes: 'JUN', oficial: 790, reportes: 820 },
];

const historicoData = [
  { mes: 'ENE', oficial: 1200, reportes: 980 },
  { mes: 'FEB', oficial: 1350, reportes: 1100 },
  { mes: 'MAR', oficial: 1280, reportes: 1200 },
  { mes: 'ABR', oficial: 1400, reportes: 1180 },
  { mes: 'MAY', oficial: 1320, reportes: 1250 },
  { mes: 'JUN', oficial: 1450, reportes: 1300 },
];

const medicamentosCriticos = [
  { nombre: 'Metformina 850mg', clave: '010.000.0412.00', stock: 12, color: 'bg-red-500' },
  { nombre: 'Paracetamol Sol.', clave: '010.000.0104.00', stock: 8, color: 'bg-red-500' },
  { nombre: 'Amoxicilina 500mg', clave: '010.000.2101.00', stock: 24, color: 'bg-amber-400' },
  { nombre: 'Losartán 50mg', clave: '010.000.0520.00', stock: 31, color: 'bg-amber-400' },
];

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


const chartTooltipStyle = {
  contentStyle: {
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '12px',
  },
};

const DashboardPage = () => {
  const [stockAvgs, setStockAvgs] = useState<StockAverages | null>(null);

  /** Stock averages card logic */

  useEffect(() => {
    getStockAvgs()
    .then(data => setStockAvgs(data))
    .catch(err => console.log("Error al obtener el abasto promedio: ", err));
  }, []);

  const renderStockValue = () => {
    if (stockAvgs?.currentMonthAvg !== undefined) {
      return `${stockAvgs.currentMonthAvg.toFixed(1)} %`; 
    }
    return "---";
  };

  const renderStockDifference = () => {
    if (stockAvgs?.lastMonthAvg !== undefined) {
      const diff = Number((stockAvgs.currentMonthAvg - stockAvgs.lastMonthAvg).toFixed(2));
      return (diff < 0 ? "-" : "+") + `${diff} %` ;
    }
    return "---";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-18">
      <Navbar variant="gobierno" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Análisis de Disponibilidad de Medicamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitoreo estratégico y detección de discrepancias en el suministro nacional.
          </p>
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
            value="12"
            icon={<AlertTriangle className="size-5" />}
            trend="Principales: Insulina, Paracetamol 500mg"
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

            {/* Discrepancia de Reportes */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="font-semibold text-foreground">Discrepancia de Reportes</h2>
                  <p className="text-xs text-muted-foreground">Datos Oficiales vs. Reportes Ciudadanos</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-500 inline-block" /> Oficial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-400 inline-block" /> Reportes
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={discrepanciaData} {...chartTooltipStyle}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line type="monotone" dataKey="oficial" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="reportes" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Datos históricos */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-1">
                <h2 className="font-semibold text-foreground">Datos históricos de reportes</h2>
                <p className="text-xs text-muted-foreground">Reportes por mes</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={historicoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line type="monotone" dataKey="oficial" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="reportes" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Carga de datos */}
            <StockFileUpload/>

            {/* Medicamentos críticos */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Medicamentos Críticos</h2>
                <button className="text-xs text-primary hover:underline">Ver todos</button>
              </div>
              <div className="flex flex-col gap-3">
                {medicamentosCriticos.map((med) => (
                  <div key={med.clave} className="flex items-center gap-3">
                    <div className={`w-1 self-stretch rounded-full ${med.color}`} />
                    <div className="p-2 rounded-lg bg-muted">
                      <Pill className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{med.nombre}</p>
                      <p className="text-xs text-muted-foreground">Clave: {med.clave}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${med.stock < 20 ? 'text-red-500' : 'text-amber-500'}`}>
                        {String(med.stock).padStart(2, '0')}%
                      </p>
                      <p className="text-xs text-muted-foreground">STOCK</p>
                    </div>
                  </div>
                ))}
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
