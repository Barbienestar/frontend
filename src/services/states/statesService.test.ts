import { getAllStates } from './statesService';
import api from '@/services/api';

jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('stateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStates', () => {
    const fakeStates = [
      { id: '1', name: 'Ciudad de México' },
      { id: '2', name: 'Jalisco' },
      { id: '3', name: 'Nuevo León' },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeStates });

      await getAllStates();

      expect(mockedApi.get).toHaveBeenCalledWith('/states');
    });

    it('retorna el listado de estados', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeStates });

      const result = await getAllStates();

      expect(result).toEqual(fakeStates);
    });

    it('retorna arreglo vacío si no hay estados', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await getAllStates();

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllStates()).rejects.toThrow('Network error');
    });
  });
});
