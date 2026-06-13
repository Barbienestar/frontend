/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './signup';

jest.mock('@/services/states/statesService', () => ({
  getAllStates: jest.fn(),
}));

jest.mock('@/services/cities/citiesService', () => ({
  getCitiesByState: jest.fn(),
}));

jest.mock('@/services/suburbs/suburbsService', () => ({
  getSuburbsByCity: jest.fn(),
}));

jest.mock('@/services/auth/authService', () => ({
  signup: jest.fn(),
}));

import { getAllStates } from '@/services/states/statesService';
import { getCitiesByState } from '@/services/cities/citiesService';
import { getSuburbsByCity } from '@/services/suburbs/suburbsService';
import { signup } from '@/services/auth/authService';

const mockStates = [
  { id: 1, name: 'Ciudad de México' },
  { id: 2, name: 'Nuevo León' },
];

const renderSignUp = () =>
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAllStates as jest.Mock).mockResolvedValue(mockStates);
    (getCitiesByState as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Monterrey' },
    ]);
    (getSuburbsByCity as jest.Mock).mockResolvedValue([
      { id: 1, zipCode: '64000', name: 'Centro' },
    ]);
  });

  it('renders heading and description', () => {
    renderSignUp();
    expect(
      screen.getByRole('heading', { name: 'Crear cuenta' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ingrese sus datos para crear su cuenta/)
    ).toBeInTheDocument();
  });

  it('loads states on mount', async () => {
    renderSignUp();
    await waitFor(() => {
      expect(getAllStates).toHaveBeenCalledTimes(1);
    });
  });

  it('shows validation errors on empty submit', async () => {
    renderSignUp();
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await waitFor(() => {
      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    });
  });

  it('calls signup on valid form submission', async () => {
    (signup as jest.Mock).mockResolvedValue(undefined);

    const user = userEvent.setup();
    const { container } = renderSignUp();

    await user.type(screen.getByPlaceholderText('Jose Miguel'), 'Juan');
    await user.type(screen.getByPlaceholderText('Perez'), 'López');
    await user.type(screen.getByPlaceholderText('Marquez'), 'García');
    await user.type(
      screen.getByPlaceholderText('jmperez@gmail.com'),
      'juan@test.com'
    );
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Pass123');
    await user.type(passwordInputs[1], 'Pass123');
    await user.type(screen.getByPlaceholderText('24'), '30');

    const stateSelect = container.querySelector(
      'select[name="stateId"]'
    ) as HTMLSelectElement;
    await user.selectOptions(stateSelect, '2');

    await waitFor(() => {
      expect(getCitiesByState).toHaveBeenCalledWith(2);
    });

    const citySelect = container.querySelector(
      'select[name="cityId"]'
    ) as HTMLSelectElement;
    await user.selectOptions(citySelect, '1');

    await waitFor(() => {
      expect(getSuburbsByCity).toHaveBeenCalledWith(1);
    });

    const suburbSelect = container.querySelector(
      'select[name="idSuburb"]'
    ) as HTMLSelectElement;
    await user.selectOptions(suburbSelect, '1');

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Juan',
          email: 'juan@test.com',
          roleId: 3,
          suburbId: 1,
        })
      );
    });
  });

  it('validates password mismatch', async () => {
    renderSignUp();
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await userEvent.type(passwordInputs[0], 'Pass123');
    await userEvent.type(passwordInputs[1], 'Different1');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await waitFor(() => {
      expect(
        screen.getByText('Los passwords no coinciden')
      ).toBeInTheDocument();
    });
  });

  it('handles getAllStates API error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (getAllStates as jest.Mock).mockRejectedValue(new Error('API Error'));
    renderSignUp();
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it('handles signup API error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (signup as jest.Mock).mockRejectedValue(new Error('Signup Error'));

    const user = userEvent.setup();
    const { container } = renderSignUp();

    await user.type(screen.getByPlaceholderText('Jose Miguel'), 'Juan');
    await user.type(screen.getByPlaceholderText('Perez'), 'López');
    await user.type(screen.getByPlaceholderText('Marquez'), 'García');
    await user.type(
      screen.getByPlaceholderText('jmperez@gmail.com'),
      'juan@test.com'
    );
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Pass123');
    await user.type(passwordInputs[1], 'Pass123');
    await user.type(screen.getByPlaceholderText('24'), '30');

    const stateSelect = container.querySelector(
      'select[name="stateId"]'
    ) as HTMLSelectElement;
    await user.selectOptions(stateSelect, '2');

    await waitFor(() => {
      expect(getCitiesByState).toHaveBeenCalledWith(2);
    });

    const citySelect = container.querySelector(
      'select[name="cityId"]'
    ) as HTMLSelectElement;
    await user.selectOptions(citySelect, '1');

    await waitFor(() => {
      expect(getSuburbsByCity).toHaveBeenCalledWith(1);
    });

    const suburbSelect = container.querySelector(
      'select[name="idSuburb"]'
    ) as HTMLSelectElement;
    await user.selectOptions(suburbSelect, '1');

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
