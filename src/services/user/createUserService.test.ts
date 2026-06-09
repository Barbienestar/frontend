import { createAdmin, createHealthUser } from './createUserService';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('createUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── createAdmin ───────────────────────────────────────────

  describe('createAdmin', () => {
    const adminPayload = {
      name: 'Juan',
      last_name_1: 'Pérez',
      email: 'juan@test.com',
      password: 'Pass123',
      role_id: 1,
    };

    it('llama a api.post con la ruta y datos correctos', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: { uid: 'abc123' } });

      await createAdmin(adminPayload);

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/user/privileged',
        adminPayload
      );
    });

    it('retorna el data de la respuesta', async () => {
      const fakeUser = { uid: 'abc123', email: 'juan@test.com' };
      mockedApi.post.mockResolvedValueOnce({ data: fakeUser });

      const result = await createAdmin(adminPayload);

      expect(result).toEqual(fakeUser);
    });

    it('lanza el error si api.post falla', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(createAdmin(adminPayload)).rejects.toThrow('Network error');
    });
  });

  // ─── createHealthUser ──────────────────────────────────────

  describe('createHealthUser', () => {
    const healthPayload = {
      name: 'Ana',
      last_name_1: 'López',
      email: 'ana@test.com',
      password: 'Pass123',
      role_id: 2,
      hospital_ids: [1, 3],
    };

    it('llama a api.post con la ruta y datos correctos', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: { uid: 'xyz789' } });

      await createHealthUser(healthPayload);

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/user/privileged',
        healthPayload
      );
    });

    it('retorna el data de la respuesta', async () => {
      const fakeUser = { uid: 'xyz789', email: 'ana@test.com' };
      mockedApi.post.mockResolvedValueOnce({ data: fakeUser });

      const result = await createHealthUser(healthPayload);

      expect(result).toEqual(fakeUser);
    });

    it('lanza el error si api.post falla', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Server error'));

      await expect(createHealthUser(healthPayload)).rejects.toThrow(
        'Server error'
      );
    });
  });
});
