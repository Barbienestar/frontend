/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  getMedicines,
  getHospitals,
  createReport,
  getMyReports,
  uploadImage,
  getAdminPageReports,
  changeReportStatus,
} from './reportService';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('reportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMedicines', () => {
    const fakeMedicines = [
      { id: 1, name: 'Paracetamol' },
      { id: 2, name: 'Ibuprofeno' },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeMedicines });
      await getMedicines();
      expect(mockedApi.get).toHaveBeenCalledWith('/medicines');
    });

    it('retorna el listado de medicamentos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeMedicines });
      const result = await getMedicines();
      expect(result).toEqual(fakeMedicines);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getMedicines()).rejects.toThrow('Network error');
    });
  });

  describe('getHospitals', () => {
    const fakeHospitals = [
      { id: 1, name: 'Hospital General' },
      { id: 2, name: 'IMSS Zona Norte' },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeHospitals });
      await getHospitals();
      expect(mockedApi.get).toHaveBeenCalledWith('/hospitals');
    });

    it('retorna el listado de hospitales', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeHospitals });
      const result = await getHospitals();
      expect(result).toEqual(fakeHospitals);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getHospitals()).rejects.toThrow('Network error');
    });
  });

  describe('createReport', () => {
    const fakePayload = {
      medicineId: 1,
      hospitalId: 2,
      description: 'Falta de medicamento',
    };
    const fakeReport = { id: 10, ...fakePayload, statusId: 1 };

    it('llama a api.post con la ruta y datos correctos', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeReport });
      await createReport(fakePayload as any);
      expect(mockedApi.post).toHaveBeenCalledWith('/reports', fakePayload);
    });

    it('retorna el reporte creado', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeReport });
      const result = await createReport(fakePayload as any);
      expect(result).toEqual(fakeReport);
    });

    it('lanza el error si api.post falla', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Server error'));
      await expect(createReport(fakePayload as any)).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('getMyReports', () => {
    const fakeReports = [
      { id: 1, statusId: 1 },
      { id: 2, statusId: 2 },
    ];

    it('llama a api.get con la ruta correcta', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeReports });
      await getMyReports();
      expect(mockedApi.get).toHaveBeenCalledWith('/reports/me');
    });

    it('retorna los reportes del usuario', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakeReports });
      const result = await getMyReports();
      expect(result).toEqual(fakeReports);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getMyReports()).rejects.toThrow('Network error');
    });
  });

  describe('uploadImage', () => {
    const fakeFile = new File(['img'], 'foto.png', { type: 'image/png' });
    const fakeResponse = { imageUrl: 'https://cdn.example.com/foto.png' };

    it('llama a api.post con la ruta y FormData correctos', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });
      await uploadImage(fakeFile);

      const [url, body] = mockedApi.post.mock.calls[0];
      expect(url).toBe('/image/upload');
      expect(body).toBeInstanceOf(FormData);
    });

    it('retorna la url de la imagen subida', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });
      const result = await uploadImage(fakeFile);
      expect(result).toEqual(fakeResponse);
    });

    it('lanza el error si api.post falla', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Upload error'));
      await expect(uploadImage(fakeFile)).rejects.toThrow('Upload error');
    });
  });

  describe('getAdminPageReports', () => {
    const fakePaginated = {
      content: [{ id: 1, statusId: 2 }],
      totalElements: 1,
      totalPages: 1,
    };

    it('llama a api.get con la ruta y params correctos', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakePaginated });
      await getAdminPageReports(2, 0, 10);
      expect(mockedApi.get).toHaveBeenCalledWith('/reports/status/2', {
        params: { page: 0, size: 10 },
      });
    });

    it('retorna la respuesta paginada', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: fakePaginated });
      const result = await getAdminPageReports(2, 0, 10);
      expect(result).toEqual(fakePaginated);
    });

    it('lanza el error si api.get falla', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Server error'));
      await expect(getAdminPageReports(2, 0, 10)).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('changeReportStatus', () => {
    it('llama a api.put con la ruta correcta', async () => {
      mockedApi.put.mockResolvedValueOnce({});
      await changeReportStatus(5, 3);
      expect(mockedApi.put).toHaveBeenCalledWith('/reports/5/status/3');
    });

    it('no retorna ningún valor', async () => {
      mockedApi.put.mockResolvedValueOnce({});
      const result = await changeReportStatus(5, 3);
      expect(result).toBeUndefined();
    });

    it('lanza el error si api.put falla', async () => {
      mockedApi.put.mockRejectedValueOnce(new Error('Server error'));
      await expect(changeReportStatus(5, 3)).rejects.toThrow('Server error');
    });
  });
});
