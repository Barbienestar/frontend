import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ReportSnapshotWithStock } from '@/services/report-snapshots/reportSnapshotsService';
import { getPeriodReportSnapshotsWithStock } from '@/services/report-snapshots/reportSnapshotsService';

interface PeriodStockReportGraphWithStockProps {
  hospitalId: number | undefined;
}

export const PeriodStockReportGraphWithStock = ({
  hospitalId,
}: PeriodStockReportGraphWithStockProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    subMonths(new Date(), 6)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<ReportSnapshotWithStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!hospitalId || !startDate || !endDate) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setError(false);
    });

    getPeriodReportSnapshotsWithStock(
      hospitalId,
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    )
      .then((raw) => {
        if (cancelled) return;
        const lookupReports = new Map(
          raw.map((d) => [d.reportDate, d.totalAcceptedReports])
        );
        const lookupStock = new Map(
          raw.map((d) => [d.reportDate, d.totalStock])
        );
        const filled = eachDayOfInterval({
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        }).map((date) => {
          const key = format(date, 'yyyy-MM-dd');
          return {
            reportDate: key,
            totalAcceptedReports: lookupReports.get(key) ?? 0,
            totalStock: lookupStock.get(key) ?? 0,
          };
        });
        setData(filled);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hospitalId, startDate, endDate]);

  const visibleData = hospitalId && startDate && endDate ? data : [];
  const totalReports = visibleData.reduce(
    (sum, d) => sum + d.totalAcceptedReports,
    0
  );
  const totalStock = visibleData.reduce((sum, d) => sum + d.totalStock, 0);
  const hasData = !loading && !error && visibleData.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Reportes vs stock oficial
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Reportes aceptados y stock en el rango de fechas
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {(['start', 'end'] as const).map((which) => {
            const date = which === 'start' ? startDate : endDate;
            const setDate = which === 'start' ? setStartDate : setEndDate;
            return (
              <Popover key={which}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className="justify-start min-w-[100px] text-xs"
                  >
                    {date
                      ? format(date, 'd MMM, yyyy', { locale: es })
                      : which === 'start'
                        ? 'Fecha inicio'
                        : 'Fecha fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="px-5 pb-5">
          <div className="h-[220px] w-full rounded-lg bg-muted/50 animate-pulse" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-[220px] gap-1.5 px-5">
          <p className="text-sm font-medium text-destructive">
            Error al cargar datos
          </p>
          <p className="text-xs text-muted-foreground">
            Intenta de nuevo más tarde
          </p>
        </div>
      )}

      {!loading && !error && visibleData.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[220px] gap-1.5 px-5">
          <p className="text-sm font-medium text-muted-foreground">
            Sin datos disponibles
          </p>
          <p className="text-xs text-muted-foreground">
            Selecciona un hospital y un rango de fechas
          </p>
        </div>
      )}

      {hasData && (
        <div className="px-5 pb-5">
          <div className="flex items-baseline gap-4 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">
                {totalReports.toLocaleString('es-MX')}
              </span>
              <span className="text-[11px] text-muted-foreground">
                reportes
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">
                {totalStock.toLocaleString('es-MX')}
              </span>
              <span className="text-[11px] text-muted-foreground">stock</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={visibleData}
              margin={{ top: 4, right: 4, left: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="reportStockFill1"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient
                  id="reportStockFill2"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 2"
                stroke="var(--color-border)"
                strokeOpacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="reportDate"
                tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: string) =>
                  format(new Date(val), 'd MMM', { locale: es })
                }
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                tickLine={false}
                axisLine={false}
                width={32}
                tickFormatter={(val: number) => val.toLocaleString('es-MX')}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-xs text-xs leading-relaxed space-y-1">
                      <p className="font-medium text-muted-foreground tracking-tight">
                        {label &&
                          format(new Date(label), 'd MMM, yyyy', {
                            locale: es,
                          })}
                      </p>
                      {payload
                        .filter(
                          (entry, idx, arr) =>
                            arr.findIndex((e) => e.name === entry.name) === idx
                        )
                        .map((entry) => (
                        <p
                          key={entry.name}
                          className="font-semibold text-sm tabular-nums"
                          style={{ color: entry.color }}
                        >
                          {entry.value?.toLocaleString('es-MX')}{' '}
                          <span className="font-normal text-muted-foreground text-xs">
                            {entry.name === 'totalAcceptedReports'
                              ? 'reportes'
                              : 'stock'}
                          </span>
                        </p>
                      ))}
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="totalAcceptedReports"
                fill="url(#reportStockFill1)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="totalAcceptedReports"
                stroke="var(--color-chart-1)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  r: 3.5,
                  fill: 'var(--color-chart-1)',
                  stroke: 'var(--color-card)',
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="totalStock"
                fill="url(#reportStockFill2)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="totalStock"
                stroke="var(--color-chart-2)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  r: 3.5,
                  fill: 'var(--color-chart-2)',
                  stroke: 'var(--color-card)',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
