import { Clock } from 'lucide-react';

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
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">
            Mis Reportes Recientes
          </h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:underline"
        >
          Ver todos →
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground uppercase border-b border-border">
            <th className="text-left pb-2 font-medium">Folio</th>
            <th className="text-left pb-2 font-medium">Medicamento</th>
            <th className="text-left pb-2 font-medium">Estatus</th>
            <th className="text-left pb-2 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No tienes reportes recientes.
              </td>
            </tr>
          ) : (
            reports.map((r) => (
              <tr key={r.folio}>
                <td className="py-3 font-mono text-xs text-muted-foreground">
                  {r.folio}
                </td>

                <td className="py-3">
                  <p className="font-medium text-foreground">{r.medicine}</p>
                  <p className="text-xs text-muted-foreground">{r.hospital}</p>
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.statusColor}`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <button
                      className="hover:text-foreground transition-colors"
                      title="Ver"
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <button
                      className="hover:text-foreground transition-colors"
                      title="Editar"
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4.5 1.5 1.5-4.5 12.362-12.226z"
                        />
                      </svg>
                    </button>

                    <button
                      className="hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
