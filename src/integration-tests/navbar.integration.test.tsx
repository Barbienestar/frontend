/**
 * @jest-environment jsdom
 */

jest.mock('@/contexts/useAuth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/components/Global/EditProfileDialog', () => () => null);

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '@/components/Global/navbar';
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

const renderNavbar = () =>
  render(
    <MemoryRouter initialEntries={['/inicio']}>
      <Navbar variant="default" activePath="/inicio" />
    </MemoryRouter>
  );

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and title', () => {
    mockedUseAuth.mockReturnValue(mockAuth({}));

    renderNavbar();
    expect(screen.getByText('DECISION 360')).toBeInTheDocument();
    expect(screen.getByText('Consulta de medicamentos')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    mockedUseAuth.mockReturnValue(mockAuth({}));

    renderNavbar();
    expect(
      screen.getByTestId('login-navigate-navbar-button')
    ).toBeInTheDocument();
  });

  it('shows profile button when authenticated', () => {
    mockedUseAuth.mockReturnValue(mockAuth({ isAuthenticated: true }));

    renderNavbar();
    expect(screen.getByTestId('navbar-profile-button')).toBeInTheDocument();
  });

  it('shows admin links for admin role', () => {
    mockedUseAuth.mockReturnValue(
      mockAuth({
        isAuthenticated: true,
        hasRole: jest.fn((role: string) => role === 'admin'),
        signOut: jest.fn(),
      })
    );

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Navbar variant="admin" activePath="/admin" />
      </MemoryRouter>
    );
    expect(screen.getByText('Panel de Control Admin')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('opens profile dropdown on click', () => {
    mockedUseAuth.mockReturnValue(
      mockAuth({ isAuthenticated: true, signOut: jest.fn() })
    );

    renderNavbar();
    fireEvent.click(screen.getByTestId('navbar-profile-button'));
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });
});
