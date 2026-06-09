import { getStateSupplyHeatmap } from './stateSupply';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('heatmapService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStateSupplyHeatmap', () => {
    const fakeHeatmap = [
      { stateId: 1, stateName: 'Jalisco', avgStock: 80, level: 'CA-01' },
      { stateId: 2, stateName: 'Oaxaca', avgStock: 15, level: 'CA-04' },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeHeatmap });
      await getStateSupplyHeatmap();
      expect(mockedApi.get).toHaveBeenCalledWith('/states/heatmap');
    });

    it('retorna los datos del heatmap', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeHeatmap });
      const result = await getStateSupplyHeatmap();
      expect(result).toEqual(fakeHeatmap);
    });

    it('retorna arreglo vacío si no hay datos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });
      const result = await getStateSupplyHeatmap();
      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getStateSupplyHeatmap()).rejects.toThrow('Network error');
    });
  });
});