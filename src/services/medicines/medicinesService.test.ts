import { uploadMedicineStock } from './medicinesService';
import api from '@/services/api';

jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('uploadStockService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadMedicineStock', () => {
    const fakeFile = new File(['data'], 'stock.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fakeResponse = { uploaded: true, rows: 42 };

    it('llama a api.post con la ruta correcta', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });
      await uploadMedicineStock('7', fakeFile);

      const [url] = mockedApi.post.mock.calls[0];
      expect(url).toBe('/medicines/upload-stock/7');
    });

    it('envía un FormData como body', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });
      await uploadMedicineStock('7', fakeFile);

      const [, body] = mockedApi.post.mock.calls[0];
      expect(body).toBeInstanceOf(FormData);
    });

    it('envía el header Content-Type correcto', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });
      await uploadMedicineStock('7', fakeFile);

      const [, , config] = mockedApi.post.mock.calls[0];
      expect(config?.headers?.['Content-Type']).toBe('multipart/form-data');
    });

    it('retorna la respuesta del servidor', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });
      const result = await uploadMedicineStock('7', fakeFile);
      expect(result).toEqual(fakeResponse);
    });

    it('lanza el error si api.post falla', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Upload error'));
      await expect(uploadMedicineStock('7', fakeFile)).rejects.toThrow('Upload error');
    });
  });
});