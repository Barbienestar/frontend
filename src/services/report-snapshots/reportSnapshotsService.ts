import api from '../api';

export interface ReportSnapshot {
  reportDate: string;
  totalAcceptedReports: number;
}

export interface ReportSnapshotWithStock {
  reportDate: string;
  totalAcceptedReports: number;
  totalStock: number;
}

export const getPeriodReportSnapshots = async (
  hospitalId: number,
  startDate: string,
  endDate: string
): Promise<ReportSnapshot[]> => {
  const res = await api.get<ReportSnapshot[]>(
    `/reports-snapshots/period/${hospitalId}`,
    {
      params: {
        startDate,
        endDate,
      },
    }
  );
  return res.data;
};

export const getPeriodReportSnapshotsWithStock = async (
  hospitalId: number,
  startDate: string,
  endDate: string
): Promise<ReportSnapshotWithStock[]> => {
  const res = await api.get<ReportSnapshotWithStock[]>(
    `/reports-snapshots/period/${hospitalId}/with-stock`,
    {
      params: {
        startDate,
        endDate,
      },
    }
  );
  return res.data;
};
