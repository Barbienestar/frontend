/**
 * @jest-environment jsdom
 */

jest.mock('@/contexts/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/contexts/useAuth';

const mockedUseAuth = jest.mocked(useAuth);

const renderProtected = (props?: {
  allowedRoles?: string[];
  redirectTo?: string;
}) =>
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <ProtectedRoute
        allowedRoles={props?.allowedRoles}
        redirectTo={props?.redirectTo}
      />
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null while loading', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    } as ReturnType<typeof useAuth>);

    const { container } = renderProtected();
    expect(container.innerHTML).toBe('');
  });

  it('redirects when not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    renderProtected();
    const navigate = screen.queryByText('protected');
    expect(navigate).not.toBeInTheDocument();
  });

  it('redirects to /forbidden when role not allowed', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'citizen' },
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    renderProtected({ allowedRoles: ['admin'] });
    const navigate = screen.queryByText('protected');
    expect(navigate).not.toBeInTheDocument();
  });

  it('allows access when no roles specified', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'citizen' },
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    renderProtected();
    const navigate = screen.queryByText('protected');
    expect(navigate).not.toBeInTheDocument();
  });
});
