import { updateProfile } from './profileService';
import api from './api';

jest.mock('./api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProfile', () => {
    const fakeUpdate = { name: 'Ana', lastName1: 'López' };
    const fakeProfile = {
      id: 1,
      name: 'Ana',
      lastName1: 'López',
      lastName2: null,
      age: null,
      suburb: null,
      role: 'citizen',
      email: 'ana@test.com',
    };

    it('llama a api.patch con la ruta y datos correctos', async () => {
      mockedApi.patch.mockResolvedValueOnce({ data: fakeProfile });
      await updateProfile(fakeUpdate);
      expect(mockedApi.patch).toHaveBeenCalledWith('/user', fakeUpdate);
    });

    it('retorna el perfil actualizado', async () => {
      mockedApi.patch.mockResolvedValueOnce({ data: fakeProfile });
      const result = await updateProfile(fakeUpdate);
      expect(result).toEqual(fakeProfile);
    });

    it('lanza el error si api.patch falla', async () => {
      mockedApi.patch.mockRejectedValueOnce(new Error('Server error'));
      await expect(updateProfile(fakeUpdate)).rejects.toThrow('Server error');
    });
  });
});
