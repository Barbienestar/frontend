/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfileDialog from './EditProfileDialog';

jest.mock('@/contexts/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/profileService', () => ({
  updateProfile: jest.fn(),
}));

jest.mock('@/services/states/statesService', () => ({
  getAllStates: jest.fn(),
}));

jest.mock('@/services/cities/citiesService', () => ({
  getCitiesByState: jest.fn(),
}));

jest.mock('@/services/suburbs/suburbsService', () => ({
  getSuburbsByCity: jest.fn(),
}));

import { useAuth } from '@/contexts/useAuth';
import { updateProfile } from '@/services/profileService';
import { getAllStates } from '@/services/states/statesService';

const mockUser = {
  id: 1,
  email: 'test@test.com',
  name: 'Juan',
  lastName1: 'Pérez',
  lastName2: 'García',
  age: 30,
  suburb: { id: 1, name: 'Centro' },
};

const renderDialog = () => render(<EditProfileDialog />);

describe('EditProfileDialog', () => {
  const setUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, setUser });
    (getAllStates as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Nuevo León' },
    ]);
  });

  it('renders trigger button', () => {
    renderDialog();
    expect(screen.getByText('Editar perfil')).toBeInTheDocument();
  });

  it('opens dialog with user data on click', async () => {
    renderDialog();
    await userEvent.click(screen.getByText('Editar perfil'));
    await waitFor(() => {
      expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('García')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByText('Centro')).toBeInTheDocument();
  });

  it('calls updateProfile on save', async () => {
    (updateProfile as jest.Mock).mockResolvedValue(mockUser);
    renderDialog();
    await userEvent.click(screen.getByText('Editar perfil'));
    await screen.findByText('Editar Perfil');

    await userEvent.clear(screen.getByDisplayValue('Juan'));
    await userEvent.type(screen.getByLabelText('Nombre(s)'), 'Carlos');

    await userEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Carlos' })
      );
    });
    expect(setUser).toHaveBeenCalledWith(mockUser);
  });

  it('shows error on update failure', async () => {
    (updateProfile as jest.Mock).mockRejectedValue(new Error('Fail'));
    renderDialog();
    await userEvent.click(screen.getByText('Editar perfil'));
    await screen.findByText('Editar Perfil');

    await userEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(
        screen.getByText('Error al actualizar perfil. Intenta de nuevo.')
      ).toBeInTheDocument();
    });
  });

  it('shows location change UI when clicking Cambiar', async () => {
    renderDialog();
    await userEvent.click(screen.getByText('Editar perfil'));
    await screen.findByText('Editar Perfil');

    await userEvent.click(screen.getByText('Cambiar'));
    await waitFor(() => {
      expect(screen.getByText('Estado')).toBeInTheDocument();
    });
  });
});
