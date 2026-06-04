import api from '../api';

export interface StockAverages {
  lastMonthAvg: number;
  currentMonthAvg: number;
}

export interface StockAveragesDto {
  firstDate: string;
  secondDate: string;
}

export interface StockReport {
  lowStockCount: number;
  bottomMedicines: string[];
}

export interface StockReportDto {
  firstDate: string;
  secondDate: string;
}

export interface MonthlyReports {
  currentMonthReportCount: number;
  comparisonToLastMonth: number;
}

export interface MonthlyReportsDto {
  firstDate: string;
  secondDate: string;
}

export const getStockAvgs = async (
  idHospital: number,
  req: StockAveragesDto
): Promise<StockAverages> => {
  const response = await api.get<StockAverages>(
    `/medicines-hospitals/${idHospital}/average-stock`,
    {
      params: req,
    }
  );
  return response.data;
};

export const getStockReport = async (
  idHospital: number,
  req: StockReportDto
): Promise<StockReport> => {
  const response = await api.get<StockReport>(
    `/medicines-hospitals/${idHospital}/stock-report`,
    {
      params: req,
    }
  );

  return response.data;
};

export const getMonthlyReports = async (
  idHospital: number,
  req: MonthlyReportsDto
): Promise<MonthlyReports> => {
  const response = await api.get<MonthlyReports>(
    `/medicines-hospitals/${idHospital}/monthly-reports`,
    {
      params: req,
    }
  );

  return response.data;
};
