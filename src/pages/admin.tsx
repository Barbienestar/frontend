import { Check, Clock, Stethoscope, UserCog, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { FullReportData } from '@/common/FullReportData';
import type { StatusResponse } from '@/common/StatusResponse';
import { AdminReportsTable } from '@/components/AdminReportsTable/AdminReportsTable';
import { AdminCreationForm } from '@/components/AdminUserCreation/AdminCreationForm';
import { HealthUserCreationForm } from '@/components/AdminUserCreation/HealthUserCreationForm';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import { Button } from '@/components/Button/button';
import Navbar from '@/components/Global/navbar';
import { MetricCard } from '@/components/MetricCards/metric-card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { MetricCardVariant } from '@/components/ui/metric-card';
import { changeReportStatus } from '@/services/report/reportService';
import {
  getReportsCountByStatus,
  listStatuses,
} from '@/services/status/statusService';

interface StatusWithCount extends StatusResponse {
  count: number;
}

const METRIC_CONFIG: Record<
  string,
  { icon: React.ReactNode; variant: MetricCardVariant; trend: string }
> = {
  accepted: {
    icon: <Check className="w-5 h-5" />,
    variant: 'approved',
    trend: 'Reportes completados',
  },
  declined: {
    icon: <XCircle className="w-5 h-5" />,
    variant: 'rejected',
    trend: 'Reportes rechazados',
  },
  reviewing: {
    icon: <Clock className="w-5 h-5" />,
    variant: 'pending',
    trend: 'En espera de revisión',
  },
};

const STATUS_ALIASES: Record<string, string> = {
  accepted: 'accepted',
  approved: 'accepted',
  declined: 'declined',
  rejected: 'declined',
  reviewing: 'reviewing',
  pending: 'reviewing',
};

const normalize = (name: string) => name.toLowerCase().trim();

const findStatusId = (
  statuses: StatusWithCount[],
  aliases: string[]
): number | undefined => {
  for (const status of statuses) {
    const key = STATUS_ALIASES[normalize(status.name)];
    if (key && aliases.includes(key)) return status.id;
  }
};

export const Admin = () => {
  const [statuses, setStatuses] = useState<StatusWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  const fetchStatuses = useCallback(async () => {
    try {
      const statusList = await listStatuses();
      const statusesWithCounts = await Promise.all(
        statusList.map(async (status) => {
          const countData = await getReportsCountByStatus(status.id);
          return { ...status, count: countData.count };
        })
      );
      setStatuses(statusesWithCounts);
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const acceptedId = findStatusId(statuses, ['accepted']);
  const declinedId = findStatusId(statuses, ['declined']);
  const pendingId = findStatusId(statuses, ['reviewing']) ?? 2;

  const changeAndRefresh = useCallback(
    async (
      report: FullReportData,
      targetId: number | undefined,
      label: string
    ) => {
      if (!targetId) {
        console.warn(`Status "${label}" not found`);
        return;
      }
      try {
        await changeReportStatus(report.id, targetId);
        setRefetchKey((k) => k + 1);
        await fetchStatuses();
        toast.success(
          label === 'accept' ? 'Reporte aceptado.' : 'Reporte rechazado.'
        );
      } catch {
        toast.error('Error al cambiar el estado del reporte.');
      }
    },
    [fetchStatuses]
  );

  const handleAccept = useCallback(
    (report: FullReportData) => changeAndRefresh(report, acceptedId, 'accept'),
    [changeAndRefresh, acceptedId]
  );

  const handleReject = useCallback(
    (report: FullReportData) => changeAndRefresh(report, declinedId, 'reject'),
    [changeAndRefresh, declinedId]
  );

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Navbar variant="admin" activePath="/admin" />
        <main className="flex-1 w-full px-4 pt-24 pb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar variant="admin" activePath="/admin" />
      <main className="flex-1 w-full px-4 pt-24 pb-6">
        <div className="mb-6 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Moderación de reportes</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
                Crear
              </span>
              <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    <UserCog className="size-3.5" />
                    Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
                  <div className="overflow-y-auto max-h-[90vh] p-4">
                    <AdminCreationForm
                      onSuccess={() => setAdminModalOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={healthModalOpen} onOpenChange={setHealthModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Stethoscope className="size-3.5" />
                    Salud
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
                  <div className="overflow-y-auto max-h-[90vh] p-4">
                    <HealthUserCreationForm
                      onSuccess={() => setHealthModalOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/inicio' },
              { label: 'Administración de reportes' },
            ]}
          />
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statuses.map((status) => {
              const config =
                METRIC_CONFIG[normalize(status.name)] ??
                METRIC_CONFIG.reviewing;
              return (
                <MetricCard
                  key={status.id}
                  label={
                    status.name.charAt(0).toUpperCase() + status.name.slice(1)
                  }
                  value={status.count}
                  icon={config.icon}
                  trend={config.trend}
                  variant={config.variant}
                />
              );
            })}
          </div>
          <AdminReportsTable
            key={refetchKey}
            statusId={pendingId}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </main>
    </div>
  );
};
