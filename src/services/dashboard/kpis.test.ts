import {
  getStockAvgs,
  getStockReport,
  getMonthlyReports,
} from './kpis';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('dashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStockAvgs', () => {
    const dto = { firstDate: '2025-01-01', secondDate: '2025-01-31' };
    const fakeAvgs = { lastMonthAvg: 120, currentMonthAvg: 95 };

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeAvgs });
      await getStockAvgs(1, dto);
      expect(mockedApi.get).toHaveBeenCalledWith(
        '/medicines-hospitals/1/average-stock',
        { params: dto }
      );
    });

    it('retorna los promedios de stock', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeAvgs });
      const result = await getStockAvgs(1, dto);
      expect(result).toEqual(fakeAvgs);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));
      await expect(getStockAvgs(1, dto)).rejects.toThrow('Server error');
    });
  });

  describe('getStockReport', () => {
    const dto = { firstDate: '2025-01-01', secondDate: '2025-01-31' };
    const fakeReport = {
      lowStockCount: 5,
      bottomMedicines: ['Insulina', 'Paracetamol'],
    };

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeReport });
      await getStockReport(1, dto);
      expect(mockedApi.get).toHaveBeenCalledWith(
        '/medicines-hospitals/1/stock-report',
        { params: dto }
      );
    });

    it('retorna el reporte de stock', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeReport });
      const result = await getStockReport(1, dto);
      expect(result).toEqual(fakeReport);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));
      await expect(getStockReport(1, dto)).rejects.toThrow('Server error');
    });
  });

  describe('getMonthlyReports', () => {
    const dto = { firstDate: '2025-01-01', secondDate: '2025-01-31' };
    const fakeMonthly = { currentMonthReportCount: 30, comparisonToLastMonth: 5 };

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeMonthly });
      await getMonthlyReports(1, dto);
      expect(mockedApi.get).toHaveBeenCalledWith(
        '/medicines-hospitals/1/monthly-reports',
        { params: dto }
      );
    });

    it('retorna el conteo de reportes mensuales', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeMonthly });
      const result = await getMonthlyReports(1, dto);
      expect(result).toEqual(fakeMonthly);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));
      await expect(getMonthlyReports(1, dto)).rejects.toThrow('Server error');
    });
  });
});