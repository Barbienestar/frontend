/**
 * @jest-environment jsdom
 */

jest.mock('firebase/app', () => ({
  __esModule: true,
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/auth', () => ({
  __esModule: true,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({})),
  getAuth: jest.fn(() => ({})),
}));
jest.mock('@/services/auth/auth', () => ({ __esModule: true, auth: {} }));
jest.mock('@/services/auth/authService');
jest.mock('@/services/api');
jest.mock('@/components/Global/EditProfileDialog', () => () => null);
jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}));
jest.mock('@/contexts/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Access from '@/pages/access';
import { useAuth } from '@/contexts/useAuth';

const mockedUseAuth = jest.mocked(useAuth);

describe('Access page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      hasRole: jest.fn(),
      setUser: jest.fn(),
    } as ReturnType<typeof useAuth>);

    render(
      <MemoryRouter>
        <Access />
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
  });

  it('renders brand panel title', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      hasRole: jest.fn(),
      setUser: jest.fn(),
    } as ReturnType<typeof useAuth>);

    render(
      <MemoryRouter>
        <Access />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Sistema de Abasto de Medicamentos')
    ).toBeInTheDocument();
  });

  it('shows toggle text for signup', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      hasRole: jest.fn(),
      setUser: jest.fn(),
    } as ReturnType<typeof useAuth>);

    render(
      <MemoryRouter>
        <Access />
      </MemoryRouter>
    );

    expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
  });
});
