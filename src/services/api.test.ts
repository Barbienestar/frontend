jest.mock('axios-case-converter', () => ({
  __esModule: true,
  default: (instance: unknown) => instance,
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    })),
  },
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
}));

import axios from 'axios';

const mockedAxios = jest.mocked(axios);
const mockCreate = mockedAxios.create as jest.Mock;

if (typeof localStorage === 'undefined') {
  const store: Record<string, string> = {};
  global.localStorage = {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
    length: 0,
    key: jest.fn(() => null),
  };
}

import './api';

const axiosInstance = mockCreate.mock.results[0]?.value;
const requestUse = axiosInstance.interceptors.request.use as jest.Mock;
const responseUse = axiosInstance.interceptors.response.use as jest.Mock;
const requestHandler = requestUse.mock.calls[0]?.[0];
const responseHandler = responseUse.mock.calls[0]?.[0];
const errorHandler = responseUse.mock.calls[0]?.[1];

describe('api', () => {
  describe('creation', () => {
    it('creates axios instance with correct config', () => {
      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080',
        timeout: 5000,
      });
    });

    it('registers request and response interceptors', () => {
      expect(requestUse).toHaveBeenCalledTimes(1);
      expect(responseUse).toHaveBeenCalledTimes(1);
    });
  });

  describe('request interceptor', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });

    it('adds Accept header', () => {
      const config = requestHandler({ headers: {} });
      expect(config.headers.Accept).toBe('application/json');
    });

    it('adds Bearer token when token exists', () => {
      localStorage.setItem('token', 'test-token-123');
      const config = requestHandler({ headers: {} });
      expect(config.headers.Authorization).toBe('Bearer test-token-123');
    });

    it('does not add Authorization header when no token', () => {
      const config = requestHandler({ headers: {} });
      expect(config.headers.Authorization).toBeUndefined();
    });

    it('preserves existing headers', () => {
      localStorage.setItem('token', 'tok');
      const config = requestHandler({
        headers: { 'Content-Type': 'application/json' },
      });
      expect(config.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('response interceptor', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });

    it('passes through successful responses', () => {
      const response = { data: 'ok' };
      expect(responseHandler(response)).toBe(response);
    });

    it('rejects error without response', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = new Error('Network error');

      await expect(errorHandler(error)).rejects.toThrow('Network error');
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('logs and rejects 401 errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = { response: { status: 401 } };

      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy).toHaveBeenCalledWith('No authorization');
      consoleSpy.mockRestore();
    });

    it('logs and rejects 500 errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = { response: { status: 500 } };

      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy).toHaveBeenCalledWith('Server error');
      consoleSpy.mockRestore();
    });
  });
});
