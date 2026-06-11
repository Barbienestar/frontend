import { listStatuses, getReportsCountByStatus } from './statusService';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('statusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listStatuses', () => {
    const fakeStatuses = [
      { id: 1, name: 'Pendiente' },
      { id: 2, name: 'Aceptado' },
      { id: 3, name: 'Rechazado' },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeStatuses });

      await listStatuses();

      expect(mockedApi.get).toHaveBeenCalledWith('/status');
    });

    it('retorna el listado de estatus', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeStatuses });

      const result = await listStatuses();

      expect(result).toEqual(fakeStatuses);
    });

    it('retorna arreglo vacío si no hay estatus', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await listStatuses();

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(listStatuses()).rejects.toThrow('Network error');
    });
  });

  describe('getReportsCountByStatus', () => {
    const fakeCount = { statusId: 2, count: 14 };

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCount });

      await getReportsCountByStatus(2);

      expect(mockedApi.get).toHaveBeenCalledWith('/reports/status/2/count');
    });

    it('retorna el conteo correctamente', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCount });

      const result = await getReportsCountByStatus(2);

      expect(result).toEqual(fakeCount);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));

      await expect(getReportsCountByStatus(2)).rejects.toThrow('Server error');
    });
  });
});
