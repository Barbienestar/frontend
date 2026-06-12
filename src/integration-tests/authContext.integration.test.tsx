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
  getAuth: jest.fn(() => ({})),
}));
jest.mock('@/services/auth/auth', () => ({ __esModule: true, auth: {} }));
jest.mock('@/services/api');
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/useAuth';
import api from '@/services/api';
import { onAuthStateChanged } from 'firebase/auth';

const mockedApi = api as jest.Mocked<typeof api>;

function TestConsumer() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="auth-status">
        {auth.isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </span>
      <span data-testid="auth-loading">
        {auth.isLoading ? 'loading' : 'loaded'}
      </span>
      {auth.user && <span data-testid="auth-user">{auth.user.name}</span>}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('shows not authenticated when no firebase user', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation(
      (_auth: unknown, cb: (user: null) => void) => {
        cb(null);
        return () => {};
      }
    );

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe(
        'not-authenticated'
      );
    });

    expect(screen.getByTestId('auth-status').textContent).toBe(
      'not-authenticated'
    );
  });

  it('loads user from api when firebase user exists', async () => {
    const fakeToken = 'firebase-token';
    const fakeUser = { id: 1, name: 'Ana', role: 'citizen' };

    (onAuthStateChanged as jest.Mock).mockImplementation(
      (
        _auth: unknown,
        cb: (user: { getIdToken: () => Promise<string> }) => void
      ) => {
        cb({
          getIdToken: jest.fn().mockResolvedValue(fakeToken),
        });
        return () => {};
      }
    );

    mockedApi.get.mockResolvedValue({ data: fakeUser });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-loading').textContent).toBe('loaded');
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');
    expect(screen.getByTestId('auth-user').textContent).toBe('Ana');
  });

  it('falls back to stored user when api fails', async () => {
    const storedUser = { id: 2, name: 'Luis', role: 'citizen' };
    localStorage.setItem('user', JSON.stringify(storedUser));
    localStorage.setItem('token', 'old-token');

    (onAuthStateChanged as jest.Mock).mockImplementation(
      (
        _auth: unknown,
        cb: (user: { getIdToken: () => Promise<string> }) => void
      ) => {
        cb({
          getIdToken: jest.fn().mockResolvedValue('new-token'),
        });
        return () => {};
      }
    );

    mockedApi.get.mockRejectedValue(new Error('Network error'));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-loading').textContent).toBe('loaded');
    });

    expect(screen.getByTestId('auth-user').textContent).toBe('Luis');
  });
});
