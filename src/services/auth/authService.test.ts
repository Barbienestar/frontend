// @jest-environment jsdom
/* eslint-disable @typescript-eslint/no-explicit-any */

import { signup, login, loginWithGoogle, logout, getStoredUser } from './authService';
import api from '../api';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

// 1. Mock de Firebase auth funciones
jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// 2. Mock del módulo auth propio de tu aplicación
const fakeAuthInstance = {} as any; 
jest.mock('./auth', () => ({
  auth: fakeAuthInstance,
}));

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

// 3. Corrección de tipado TypeScript
const mockedSignIn = signInWithEmailAndPassword as jest.MockedFunction<
  typeof signInWithEmailAndPassword
>;
const mockedSignInWithPopup = signInWithPopup as jest.MockedFunction<
  typeof signInWithPopup
>;
const mockedSignOut = signOut as jest.MockedFunction<typeof signOut>;

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

const fakeCredential = {
  user: { getIdToken: jest.fn().mockResolvedValue('fake-token') },
};

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('signup', () => {
    const req = {
      name: 'Ana',
      last_name_1: 'López',
      email: 'ana@test.com',
      password: 'Pass123',
      roleId: 3,
    };

    it('llama a api.post y luego a signInWithEmailAndPassword', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeProfile });
      mockedSignIn.mockResolvedValueOnce(fakeCredential as any);

      await signup(req);

      expect(mockedApi.post).toHaveBeenCalledWith('/user/citizen', req);
      expect(mockedSignIn).toHaveBeenCalledWith(fakeAuthInstance, req.email, req.password);
    });

    it('guarda el token y el usuario en localStorage', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeProfile });
      mockedSignIn.mockResolvedValueOnce(fakeCredential as any);

      await signup(req);

      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(fakeProfile));
    });

    it('retorna el perfil del usuario', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: fakeProfile });
      mockedSignIn.mockResolvedValueOnce(fakeCredential as any);

      const result = await signup(req);
      expect(result).toEqual(fakeProfile);
    });

    it('lanza el error si api.post falla', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Server error'));
      await expect(signup(req)).rejects.toThrow('Server error');
    });
  });

  describe('login', () => {
    it('guarda el token y el perfil en localStorage', async () => {
      mockedSignIn.mockResolvedValueOnce(fakeCredential as any);
      mockedApi.get.mockResolvedValueOnce({ data: fakeProfile });

      await login('ana@test.com', 'Pass123');

      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(fakeProfile));
    });

    it('retorna el perfil del usuario', async () => {
      mockedSignIn.mockResolvedValueOnce(fakeCredential as any);
      mockedApi.get.mockResolvedValueOnce({ data: fakeProfile });

      const result = await login('ana@test.com', 'Pass123');
      expect(result).toEqual(fakeProfile);
    });

    it('lanza el error si Firebase falla', async () => {
      mockedSignIn.mockRejectedValueOnce(new Error('auth/wrong-password'));
      await expect(login('ana@test.com', 'wrong')).rejects.toThrow(
        'auth/wrong-password'
      );
    });
  });

  describe('loginWithGoogle', () => {
    it('guarda el token y el perfil en localStorage', async () => {
      mockedSignInWithPopup.mockResolvedValueOnce(fakeCredential as any);
      mockedApi.get.mockResolvedValueOnce({ data: fakeProfile });

      await loginWithGoogle();

      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(fakeProfile));
    });

    it('retorna el perfil del usuario', async () => {
      mockedSignInWithPopup.mockResolvedValueOnce(fakeCredential as any);
      mockedApi.get.mockResolvedValueOnce({ data: fakeProfile });

      const result = await loginWithGoogle();
      expect(result).toEqual(fakeProfile);
    });

    it('lanza el error si Firebase falla', async () => {
      mockedSignInWithPopup.mockRejectedValueOnce(new Error('auth/popup-closed'));
      await expect(loginWithGoogle()).rejects.toThrow('auth/popup-closed');
    });
  });

  describe('logout', () => {
    it('llama a signOut y limpia localStorage', async () => {
      mockedSignOut.mockResolvedValueOnce();
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(fakeProfile));

      await logout();

      expect(mockedSignOut).toHaveBeenCalledWith(fakeAuthInstance);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getStoredUser', () => {
    it('retorna el usuario guardado en localStorage', () => {
      localStorage.setItem('user', JSON.stringify(fakeProfile));
      const result = getStoredUser();
      expect(result).toEqual(fakeProfile);
    });

    it('retorna null si no hay usuario guardado', () => {
      const result = getStoredUser();
      expect(result).toBeNull();
    });

    it('retorna null si el JSON está corrupto', () => {
      localStorage.setItem('user', 'esto-no-es-json{{{');
      const result = getStoredUser();
      expect(result).toBeNull();
    });
  });
});