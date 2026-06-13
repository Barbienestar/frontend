import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptySearchCTA } from './emptySearchCTA';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/components/Button/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('EmptySearchCTA', () => {
  afterEach(() => {
    mockNavigate.mockClear();
  });

  it('renders search prompt text', () => {
    render(<EmptySearchCTA />);
    expect(
      screen.getByText('¿No encontraste lo que buscas?')
    ).toBeInTheDocument();
  });

  it('renders report button', () => {
    render(<EmptySearchCTA />);
    expect(
      screen.getByText('Iniciar Reporte de Desabasto')
    ).toBeInTheDocument();
  });

  it('button navigates to /reportar', async () => {
    const user = userEvent.setup();
    render(<EmptySearchCTA />);
    await user.click(screen.getByText('Iniciar Reporte de Desabasto'));
    expect(mockNavigate).toHaveBeenCalledWith('/reportar');
  });
});
