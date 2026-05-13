import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2, History, Search } from 'lucide-react';
import Navbar from '@/components/Global/navbar';
import { Footer } from '@/components/Global/footer';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import { PageHeader } from '@/components/PageHeader/pageHeader';
import { getMyReports } from '@/services/reportService';
import { statusConfig } from '@/utils/reportStatus';
import type { ReportData } from '@/common/ReportData ';

const MyReportsPage = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filtered, setFiltered] = useState<ReportData[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyReports()
      .then((data) => {
        setReports(data);
        setFiltered(data);
      })
      .catch(() => setError('Error al cargar tus reportes. Intenta de nuevo.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let result = reports;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.medicineName.toLowerCase().includes(q) ||
          r.hospitalName.toLowerCase().includes(q) ||
          String(r.id).includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, reports]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="default" activePath="/mis-reportes" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/inicio' },
            { label: 'Reportar Desabasto', href: '/report' },
            { label: 'Mis Reportes' },
          ]}
        />

        <PageHeader
          title="Mis Reportes"
          subtitle="Historial completo de tus reportes de desabasto."
        />

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por folio, medicamento u hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm
                         text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todos los estatus</option>
            <option value="accepted">Atendido</option>
            <option value="reviewing">En revisión</option>
            <option value="declined">Rechazado</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <History className="size-5 text-amber-600" />
              <h2 className="text-lg font-bold text-foreground">Todos mis Reportes</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'reporte' : 'reportes'}
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Cargando reportes...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-red-500">{error}</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Folio
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Medicamento
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Descripción
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estatus
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                      No se encontraron reportes.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const cfg = statusConfig(r.status);
                    return (
                      <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4 font-bold text-foreground text-base">
                          #{r.id}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">{r.medicineName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.hospitalName}</p>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                            {r.description}
                          </p>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <p className="text-sm text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3 text-muted-foreground">
                            <button className="hover:text-foreground transition-colors" title="Ver">
                              <Eye className="size-5" strokeWidth={1.5} />
                            </button>
                            <button className="hover:text-foreground transition-colors" title="Editar">
                              <Pencil className="size-5" strokeWidth={1.5} />
                            </button>
                            <button className="hover:text-red-500 transition-colors" title="Eliminar">
                              <Trash2 className="size-5" strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Footer variant="full" />
    </div>
  );
};

export default MyReportsPage;
