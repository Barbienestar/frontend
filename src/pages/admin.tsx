import { Check, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { StatusResponse } from '@/common/StatusResponse';
import { AdminReportsTable } from '@/components/AdminReportsTable/AdminReportsTable';
import Navbar from '@/components/Global/navbar';
import { MetricCard } from '@/components/MetricCards/metric-card';
import type { MetricCardVariant } from '@/components/ui/metric-card';
import {
  getReportsCountByStatus,
  listStatuses,
} from '@/services/statusService';

interface StatusWithCount extends StatusResponse {
  count: number;
}

export const Admin = () => {
  const [statuses, setStatuses] = useState<StatusWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Navbar variant="admin" activePath="/admin" />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  const getMetricConfig = (name: string) => {
    const lowerName = name.toLowerCase();
    switch (lowerName) {
      case 'accepted':
        return {
          icon: <Check className="w-5 h-5" />,
          variant: 'approved' as MetricCardVariant,
          trend: 'Completed reports',
        };
      case 'declined':
        return {
          icon: <XCircle className="w-5 h-5" />,
          variant: 'rejected' as MetricCardVariant,
          trend: 'Rejected reports',
        };
      case 'reviewing':
        return {
          icon: <Clock className="w-5 h-5" />,
          variant: 'pending' as MetricCardVariant,
          trend: 'Awaiting review',
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          variant: 'pending' as MetricCardVariant,
          trend: 'Total reports',
        };
    }
  };

  const pendingStatus = statuses.find((s) => s.name.toLowerCase() === 'reviewing');
  const pendingStatusId = pendingStatus?.id ?? 2;

  return (
    <div className="min-h-screen w-full">
      <Navbar variant="admin" activePath="/admin" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((status) => {
            const config = getMetricConfig(status.name);
            return (
              <MetricCard
                key={status.id}
                label={status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                value={status.count}
                icon={config.icon}
                trend={config.trend}
                variant={config.variant}
              />
            );
          })}
        </div>
        <AdminReportsTable statusId={pendingStatusId} />
      </main>
    </div>
  );
};
