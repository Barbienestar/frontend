import { Eye, Pencil, Trash2, History } from 'lucide-react';

export interface ReportRow {
  folio: string;
  medicine: string;
  hospital: string;
  status: string;
  statusColor: string;
}

interface RecentReportsTableProps {
  reports: ReportRow[];
  onViewAll?: () => void;
}

export const RecentReportsTable = ({
  reports,
  onViewAll,
}: RecentReportsTableProps) => {
  const rows = reports;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <History className="size-5 text-amber-600" />
          <h2 className="text-lg font-bold text-foreground">
            Mis Reportes Recientes
          </h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          Ver todos →
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-border bg-muted/30">
            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Folio
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Medicamento
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
          {rows.map((r) => (
            <tr key={r.folio} className="hover:bg-muted/20 transition-colors">
              <td className="px-5 py-4 font-bold text-foreground text-base">
                #{r.folio}
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-foreground">{r.medicine}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.hospital}
                </p>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${r.statusColor}`}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-3 text-muted-foreground">
                  <button
                    className="hover:text-foreground transition-colors"
                    title="Ver"
                  >
                    <Eye className="size-5" strokeWidth={1.5} />
                  </button>
                  <button
                    className="hover:text-foreground transition-colors"
                    title="Editar"
                  >
                    <Pencil className="size-5" strokeWidth={1.5} />
                  </button>
                  <button
                    className="hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="size-5" strokeWidth={1.5} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
