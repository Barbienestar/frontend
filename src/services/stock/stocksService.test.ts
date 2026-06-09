import { getStockByMedicine, searchMedicines } from './stockService';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('stockService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStockByMedicine', () => {
    const fakeStock = [
      { id: 1, medicineName: 'Paracetamol', quantity: 50, hospitalId: 2 },
      { id: 2, medicineName: 'Paracetamol', quantity: 10, hospitalId: 4 },
    ];

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeStock });

      await getStockByMedicine('Paracetamol');

      expect(mockedApi.get).toHaveBeenCalledWith('/medicines-hospitals/stock', {
        params: { medicineName: 'Paracetamol' },
      });
    });

    it('retorna el stock correctamente', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeStock });

      const result = await getStockByMedicine('Paracetamol');

      expect(result).toEqual(fakeStock);
    });

    it('retorna arreglo vacío si no hay stock', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await getStockByMedicine('MedicinaInexistente');

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));

      await expect(getStockByMedicine('Paracetamol')).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('searchMedicines', () => {
    const fakeMedicines = [
      { id: 1, name: 'Paracetamol 500mg' },
      { id: 2, name: 'Paracetamol 1g' },
    ];

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeMedicines });

      await searchMedicines('Para');

      expect(mockedApi.get).toHaveBeenCalledWith('/medicines', {
        params: { q: 'Para' },
      });
    });

    it('retorna los medicamentos encontrados', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeMedicines });

      const result = await searchMedicines('Para');

      expect(result).toEqual(fakeMedicines);
    });

    it('retorna arreglo vacío si no hay resultados', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });

      const result = await searchMedicines('xyz');

      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));

      await expect(searchMedicines('Para')).rejects.toThrow('Server error');
    });
  });
});