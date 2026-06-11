import {
  getPeriodReportSnapshots,
  getPeriodReportSnapshotsWithStock,
} from './reportSnapshotsService';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('reportSnapshotService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPeriodReportSnapshots', () => {
    const fakeSnapshots = [
      { reportDate: '2025-01-01', totalAcceptedReports: 10 },
      { reportDate: '2025-01-02', totalAcceptedReports: 7 },
    ];

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeSnapshots });

      await getPeriodReportSnapshots(1, '2025-01-01', '2025-01-31');

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/reports-snapshots/period/1',
        {
          params: {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          },
        }
      );
    });

    it('retorna los snapshots correctamente', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeSnapshots });

      const result = await getPeriodReportSnapshots(
        1,
        '2025-01-01',
        '2025-01-31'
      );

      expect(result).toEqual(fakeSnapshots);
    });

    it('retorna arreglo vacío si no hay snapshots', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await getPeriodReportSnapshots(
        1,
        '2025-06-01',
        '2025-06-30'
      );

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));

      await expect(
        getPeriodReportSnapshots(1, '2025-01-01', '2025-01-31')
      ).rejects.toThrow('Server error');
    });
  });

  describe('getPeriodReportSnapshotsWithStock', () => {
    const fakeSnapshotsWithStock = [
      { reportDate: '2025-01-01', totalAcceptedReports: 10, totalStock: 200 },
      { reportDate: '2025-01-02', totalAcceptedReports: 7, totalStock: 180 },
    ];

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeSnapshotsWithStock });

      await getPeriodReportSnapshotsWithStock(1, '2025-01-01', '2025-01-31');

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/reports-snapshots/period/1/with-stock',
        {
          params: {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          },
        }
      );
    });

    it('retorna los snapshots con stock correctamente', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeSnapshotsWithStock });

      const result = await getPeriodReportSnapshotsWithStock(
        1,
        '2025-01-01',
        '2025-01-31'
      );

      expect(result).toEqual(fakeSnapshotsWithStock);
    });

    it('retorna arreglo vacío si no hay snapshots', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await getPeriodReportSnapshotsWithStock(
        1,
        '2025-06-01',
        '2025-06-30'
      );

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));

      await expect(
        getPeriodReportSnapshotsWithStock(1, '2025-01-01', '2025-01-31')
      ).rejects.toThrow('Server error');
    });
  });
});
