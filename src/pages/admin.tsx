import { Check, Clock, UserCog, Stethoscope, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { FullReportData } from '@/common/FullReportData';
import type { StatusResponse } from '@/common/StatusResponse';
import { AdminReportsTable } from '@/components/AdminReportsTable/AdminReportsTable';
import { AdminCreationForm } from '@/components/AdminUserCreation/AdminCreationForm';
import { HealthUserCreationForm } from '@/components/AdminUserCreation/HealthUserCreationForm';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import Navbar from '@/components/Global/navbar';
import { MetricCard } from '@/components/MetricCards/metric-card';
import type { MetricCardVariant } from '@/components/ui/metric-card';
import { cn } from '@/lib/utils';
import { changeReportStatus } from '@/services/reportService';
import {
  getReportsCountByStatus,
  listStatuses,
} from '@/services/statusService';

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
    trend: 'Completed reports',
  },
  declined: {
    icon: <XCircle className="w-5 h-5" />,
    variant: 'rejected',
    trend: 'Rejected reports',
  },
  reviewing: {
    icon: <Clock className="w-5 h-5" />,
    variant: 'pending',
    trend: 'Awaiting review',
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

type UserType = 'admin' | 'health';

export const Admin = () => {
  const [statuses, setStatuses] = useState<StatusWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);
  const [userType, setUserType] = useState<UserType>('admin');

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
      } catch (error) {
        console.error(`Failed to ${label} report:`, error);
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
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar variant="admin" activePath="/admin" />
      <main className="flex-1 w-full px-4 pt-24 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl font-semibold">Moderacion de reportes</h2>
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/inicio' },
              { label: 'Administración de reportes' },
            ]}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
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
          <div className="w-full lg:w-96 shrink-0 space-y-4">
            <div className="flex rounded-xl border border-input bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  userType === 'admin'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <UserCog className="size-4" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserType('health')}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  userType === 'health'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Stethoscope className="size-4" />
                Salud
              </button>
            </div>
            {userType === 'admin' ? <AdminCreationForm /> : <HealthUserCreationForm />}
          </div>
        </div>
      </main>
    </div>
  );
};
