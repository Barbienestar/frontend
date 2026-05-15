import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FullReportData } from '@/common/FullReportData';
import type { PaginatedResponse } from '@/common/PaginatedResponse';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAdminPageReports } from '@/services/reportService';
import { AdminReportsCard } from './AdminReportsCard';

interface AdminReportsTableProps {
  statusId: number;
  pageSize?: number;
  onAccept?: (report: FullReportData) => void;
  onReject?: (report: FullReportData) => void;
}

export const AdminReportsTable = ({
  statusId = 2,
  pageSize = 3,
  onAccept,
  onReject,
}: AdminReportsTableProps) => {
  const [data, setData] = useState<PaginatedResponse<FullReportData> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAdminPageReports(statusId, page, pageSize);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [statusId, page, pageSize]);

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (data && page < data.totalPages - 1) setPage((p) => p + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {Array.from({ length: pageSize }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-3 p-3 bg-card border border-border rounded-sm w-full"
          >
            <div className="shrink-0 w-full md:w-36">
              <Skeleton className="w-full aspect-square rounded-sm" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1.5 border-y border-border">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No reports found
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {data.items.map((report) => (
          <AdminReportsCard
            key={report.id}
            data={report}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Page {data.page + 1} of {data.totalPages} ({data.totalItems} total)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handlePrev}
            disabled={page <= 0}
            className="gap-2 bg-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
            disabled={page >= data.totalPages - 1}
            className="gap-2 bg-secondary"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
