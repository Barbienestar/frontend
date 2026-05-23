import api from '../api';

export interface ReportSnapshot {
  reportDate: string;
  totalAcceptedReports: number;
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
