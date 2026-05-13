export interface StatusConfig {
  label: string;
  color: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  accepted: { label: 'Atendido',    color: 'bg-green-100 text-green-700' },
  reviewing: { label: 'En revisión', color: 'bg-amber-100 text-amber-700' },
  declined:  { label: 'Rechazado',   color: 'bg-red-100 text-red-700' },
};

export const statusConfig = (status: string): StatusConfig =>
  STATUS_MAP[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' };
