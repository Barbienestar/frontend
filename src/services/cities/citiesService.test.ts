import { getCitiesByState } from './citiesService';
import api from '@/services/api';

jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('cityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCitiesByState', () => {
    const fakeCities = [
      { id: 1, name: 'Guadalajara' },
      { id: 2, name: 'Zapopan' },
    ];

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCities });
      await getCitiesByState(14);
      expect(mockedApi.get).toHaveBeenCalledWith('/cities', {
        params: { id_state: 14 },
      });
    });

    it('retorna el listado de ciudades', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCities });
      const result = await getCitiesByState(14);
      expect(result).toEqual(fakeCities);
    });

    it('retorna arreglo vacío si no hay ciudades', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });
      const result = await getCitiesByState(99);
      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getCitiesByState(14)).rejects.toThrow('Network error');
    });
  });
});
