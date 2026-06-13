/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from './login';

jest.mock('@/components/Button/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/Input/inputField', () => ({
  InputField: ({
    testId,
    ...props
  }: {
    testId?: string;
    [key: string]: unknown;
  }) => <input data-testid={testId} {...props} />,
}));

describe('Login', () => {
  const onSubmit = jest.fn();
  const onGoogleSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Iniciar Sesión heading', () => {
    render(<Login />);
    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
  });

  it('renders email and password inputs with testIds', () => {
    render(<Login />);
    expect(screen.getByTestId('login-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument();
  });

  it('submit button shows Entrar al Sistema text', () => {
    render(<Login />);
    expect(screen.getByText('Entrar al Sistema')).toBeInTheDocument();
  });

  it('when isLoading, button shows Ingresando... and is disabled', () => {
    render(<Login isLoading />);
    const btn = screen.getByText('Ingresando...');
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it('when isGoogleLoading, Google button shows Conectando... and is disabled', () => {
    render(<Login isGoogleLoading />);
    const btn = screen.getByText('Conectando...');
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it('calls onSubmit with email and password on form submit', () => {
    render(<Login onSubmit={onSubmit} />);
    fireEvent.change(screen.getByTestId('login-email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('login-password-input'), {
      target: { value: 'secret123' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Entrar al Sistema' }));
    expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'secret123');
  });

  it('Google button calls onGoogleSignIn onClick', () => {
    render(<Login onGoogleSignIn={onGoogleSignIn} />);
    fireEvent.click(screen.getByText('Google'));
    expect(onGoogleSignIn).toHaveBeenCalledTimes(1);
  });
});
