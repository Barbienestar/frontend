import { getSuburbsByCity } from './suburbsService';
import api from '@/services/api';

jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('suburbService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSuburbsByCity', () => {
    const fakeSuburbs = [
      { id: 1, name: 'Centro', zipCode: '06000' },
      { id: 2, name: 'Roma Norte', zipCode: '06700' },
    ];

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeSuburbs });

      await getSuburbsByCity(5);

      expect(mockedApi.get).toHaveBeenCalledWith('/suburbs', {
        params: { id_city: 5 },
      });
    });

    it('retorna el listado de colonias', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeSuburbs });

      const result = await getSuburbsByCity(5);

      expect(result).toEqual(fakeSuburbs);
    });

    it('retorna arreglo vacío si no hay colonias', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await getSuburbsByCity(99);

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(getSuburbsByCity(5)).rejects.toThrow('Network error');
    });
  });
});