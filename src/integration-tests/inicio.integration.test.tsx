/**
 * @jest-environment jsdom
 */

jest.mock('@/contexts/useAuth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/components/Global/EditProfileDialog', () => () => null);

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inicio from '@/pages/inicio';
import { useAuth } from '@/contexts/useAuth';

const mockedUseAuth = jest.mocked(useAuth);

function mockAuth(overrides: Record<string, unknown>) {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    signIn: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    hasRole: jest.fn().mockReturnValue(false),
    setUser: jest.fn(),
    ...overrides,
  } as ReturnType<typeof useAuth>;
}

describe('Inicio page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section when unauthenticated', () => {
    mockedUseAuth.mockReturnValue(mockAuth({}));

    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Información sobre el abasto de medicamentos en México')
    ).toBeInTheDocument();
    expect(screen.getByText('Ver Mapa de Abasto')).toBeInTheDocument();
    expect(
      screen.getByTestId('login-navigate-index-button')
    ).toBeInTheDocument();
  });

  it('hides login button when authenticated', () => {
    mockedUseAuth.mockReturnValue(mockAuth({ isAuthenticated: true }));

    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    expect(screen.getByText('Ver Mapa de Abasto')).toBeInTheDocument();
    expect(
      screen.queryByTestId('login-navigate-index-button')
    ).not.toBeInTheDocument();
  });

  it('renders informative cards', () => {
    mockedUseAuth.mockReturnValue(mockAuth({}));

    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    expect(screen.getByText('Transparencia')).toBeInTheDocument();
    expect(screen.getByText('Eficiencia')).toBeInTheDocument();
    expect(screen.getByText('Compromiso')).toBeInTheDocument();
  });

  it('renders footer', () => {
    mockedUseAuth.mockReturnValue(mockAuth({}));

    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    expect(screen.getByText('Decision 360')).toBeInTheDocument();
  });
});
