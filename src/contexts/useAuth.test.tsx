/**
 * @jest-environment jsdom
 */

jest.mock('@/services/api');
jest.mock('firebase/app', () => ({
  __esModule: true,
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/auth', () => ({
  __esModule: true,
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));
jest.mock('@/services/auth/auth', () => ({ __esModule: true, auth: {} }));
jest.mock('@/services/auth/authService');

import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';
import AuthContext from './AuthContext';
import type { ReactNode } from 'react';
import type { UserProfile } from '@/services/auth/authService';

const fakeValue = {
  user: { id: 1, name: 'Test', role: 'citizen' } as UserProfile,
  token: 'abc',
  isAuthenticated: true,
  isLoading: false,
  signIn: jest.fn(),
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  hasRole: jest.fn(),
  setUser: jest.fn(),
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={fakeValue}>{children}</AuthContext.Provider>
  );
}

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns auth context when inside provider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Test');
    expect(result.current.token).toBe('abc');
  });

  it('throws error when used outside provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within a AuthProvider'
    );
  });
});
