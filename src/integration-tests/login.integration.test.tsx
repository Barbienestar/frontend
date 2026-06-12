// --- Mocks de módulos externos (deben ir ANTES de los imports) ---
jest.mock('firebase/app', () => ({
  __esModule: true,
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/auth', () => ({
  __esModule: true,
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
}));
jest.mock('@/services/auth/auth', () => ({ __esModule: true, auth: {} }));
jest.mock('@/services/api');

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '@/components/Login/login';
import { login } from '@/services/auth/authService';
import type { UserProfile } from '@/services/auth/authService';
import { signInWithEmailAndPassword } from 'firebase/auth';
import api from '@/services/api';

const mockedSignIn = signInWithEmailAndPassword as jest.MockedFunction<
  typeof signInWithEmailAndPassword
>;
const mockedApi = api as jest.Mocked<typeof api>;

const fakeProfile: UserProfile = {
  id: 1,
  name: 'Ana',
  lastName1: 'López',
  lastName2: null,
  age: 28,
  suburb: null,
  role: 'citizen',
  email: 'ana@test.com',
};

const fakeCredential = {
  user: { getIdToken: jest.fn().mockResolvedValue('mock-token-123') },
};

/** Wrapper que conecta el componente Login con el servicio real de auth */
const LoginConServicio = () => {
  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
  };
  return <Login onSubmit={handleSubmit} />;
};

/** Wrapper que absorbe el error (simulando lo que haría la UI real) */
const LoginConManejoDeFallo = () => {
  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch {
      // el componente real mostraría un toast aquí
    }
  };
  return <Login onSubmit={handleSubmit} />;
};

describe('Flujo de login — integración (HU-03)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('tras login exitoso guarda token y perfil en localStorage', async () => {
    const user = userEvent.setup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedSignIn.mockResolvedValueOnce(fakeCredential as any);
    mockedApi.get.mockResolvedValueOnce({ data: fakeProfile });

    render(<LoginConServicio />);

    await user.type(screen.getByTestId('login-email-input'), 'ana@test.com');
    await user.type(screen.getByTestId('login-password-input'), 'Pass123');
    await user.click(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-token-123');
    });
    expect(localStorage.getItem('user')).toBe(JSON.stringify(fakeProfile));
  });

  it('tras login exitoso llama a Firebase y luego a /auth/me', async () => {
    const user = userEvent.setup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedSignIn.mockResolvedValueOnce(fakeCredential as any);
    mockedApi.get.mockResolvedValueOnce({ data: fakeProfile });

    render(<LoginConServicio />);

    await user.type(screen.getByTestId('login-email-input'), 'ana@test.com');
    await user.type(screen.getByTestId('login-password-input'), 'Pass123');
    await user.click(screen.getByTestId('login-submit-button'));

    await waitFor(() => expect(mockedSignIn).toHaveBeenCalled());
    expect(mockedSignIn).toHaveBeenCalledWith({}, 'ana@test.com', 'Pass123');
    expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
  });

  it('con credenciales inválidas NO guarda nada en localStorage ni llama a /auth/me', async () => {
    const user = userEvent.setup();
    mockedSignIn.mockRejectedValueOnce(new Error('auth/invalid-credential'));

    render(<LoginConManejoDeFallo />);

    await user.type(screen.getByTestId('login-email-input'), 'malo@test.com');
    await user.type(screen.getByTestId('login-password-input'), 'incorrect');
    await user.click(screen.getByTestId('login-submit-button'));

    await waitFor(() => expect(mockedSignIn).toHaveBeenCalled());

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockedApi.get).not.toHaveBeenCalled();
  });
});
