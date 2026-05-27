import api from '../api';

export interface StockAverages {
  lastMonthAvg: number;
  currentMonthAvg: number;
}

export interface StockReport {
  lowStockCount: number;
  bottomMedicines: string[];
}

export interface MonthlyReports {
  currentMonthReportCount: number;
  comparisonToLastMonth: number;
}

export const getStockAvgs = async (
  idHospital: number
): Promise<StockAverages> => {
  const response = await api.get<StockAverages>(
    `/medicines-hospitals/average-stock/${idHospital}`
  );
  return response.data;
};

export const getStockReport = async (
  idHospital: number
): Promise<StockReport> => {
  const response = await api.get<StockReport>(
    `/medicines-hospitals/stock-report/${idHospital}`
  );

  return response.data;
};

export const getMonthlyReports = async (
  idHospital: number
): Promise<MonthlyReports> => {
  const response = await api.get<MonthlyReports>(
    `/medicines-hospitals/monthly-reports/${idHospital}`
  );

  return response.data;
};
