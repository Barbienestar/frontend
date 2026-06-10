import { getMyHospitals, getCriticalMedicines } from './hospitalsService';
import api from '@/services/api';

jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('hospitalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyHospitals', () => {
    const fakeHospitals = [
      { id: 1, name: 'Hospital General' },
      { id: 2, name: 'IMSS Zona Sur' },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeHospitals });
      await getMyHospitals();
      expect(mockedApi.get).toHaveBeenCalledWith('/hospitals/my-hospitals');
    });

    it('retorna el listado de hospitales', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeHospitals });
      const result = await getMyHospitals();
      expect(result).toEqual(fakeHospitals);
    });

    it('retorna arreglo vacío si no hay hospitales', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });
      const result = await getMyHospitals();
      expect(result).toEqual([]);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getMyHospitals()).rejects.toThrow('Network error');
    });
  });

  describe('getCriticalMedicines', () => {
    const fakeCritical = {
      hospitalId: 1,
      medicines: [{ id: 5, name: 'Insulina', stock: 2 }],
      totalPages: 1,
    };

    it('llama a api.get con la ruta y params por defecto correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCritical });
      await getCriticalMedicines(1);
      expect(mockedApi.get).toHaveBeenCalledWith(
        '/hospitals/1/critical-medicines',
        { params: { page: 0, size: 10 } }
      );
    });

    it('llama a api.get con el page indicado', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCritical });
      await getCriticalMedicines(1, 3);
      expect(mockedApi.get).toHaveBeenCalledWith(
        '/hospitals/1/critical-medicines',
        { params: { page: 3, size: 10 } }
      );
    });

    it('retorna los medicamentos críticos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeCritical });
      const result = await getCriticalMedicines(1);
      expect(result).toEqual(fakeCritical);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));
      await expect(getCriticalMedicines(1)).rejects.toThrow('Server error');
    });
  });
});
