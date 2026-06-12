/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HealthUserCreationForm } from './HealthUserCreationForm';

// HTMLDialogElement polyfill for jsdom
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}

jest.mock('@/services/report/reportService', () => ({
  getHospitals: jest.fn(),
}));

jest.mock('@/services/user/createUserService', () => ({
  createHealthUser: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { getHospitals } from '@/services/report/reportService';
import { createHealthUser } from '@/services/user/createUserService';
import { toast } from 'sonner';

const mockHospitals = [
  { id: 1, name: 'Hospital General' },
  { id: 2, name: 'Hospital Infantil' },
  { id: 3, name: 'Clínica Especializada' },
];

describe('HealthUserCreationForm', () => {
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getHospitals as jest.Mock).mockResolvedValue(mockHospitals);
  });

  it('renders form title and description', () => {
    render(<HealthUserCreationForm />);
    expect(screen.getByText('Crear Usuario de Salud')).toBeInTheDocument();
    expect(screen.getByText(/Registra un nuevo usuario/)).toBeInTheDocument();
  });

  it('loads and displays hospital search input', async () => {
    render(<HealthUserCreationForm />);
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText('Buscar hospital...')
      ).toBeInTheDocument()
    );
  });

  it('filters hospitals on search', async () => {
    render(<HealthUserCreationForm />);
    const searchInput =
      await screen.findByPlaceholderText('Buscar hospital...');
    await userEvent.type(searchInput, 'Infantil');
    expect(screen.getByText('Hospital Infantil')).toBeInTheDocument();
    expect(screen.queryByText('Hospital General')).not.toBeInTheDocument();
  });

  it('shows no results message when no match', async () => {
    render(<HealthUserCreationForm />);
    const searchInput =
      await screen.findByPlaceholderText('Buscar hospital...');
    await userEvent.type(searchInput, 'zzzzz');
    expect(
      screen.getByText('No se encontraron hospitales con ese nombre.')
    ).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<HealthUserCreationForm />);
    const submitBtn = screen.getByText('Crear usuario de salud');
    await userEvent.click(submitBtn);
    await waitFor(() =>
      expect(
        screen.getByText('¿Está seguro que desea crear este usuario de salud?')
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByTestId('confirmation-modal-confirm-button'));
    await waitFor(() => {
      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    });
  });

  it('calls createHealthUser on valid submit', async () => {
    (createHealthUser as jest.Mock).mockResolvedValue(undefined);
    render(<HealthUserCreationForm onSuccess={onSuccess} />);

    const searchInput =
      await screen.findByPlaceholderText('Buscar hospital...');

    await userEvent.type(screen.getByPlaceholderText('Jose Miguel'), 'Juan');
    await userEvent.type(screen.getByPlaceholderText('Perez'), 'López');
    await userEvent.type(
      screen.getByPlaceholderText('admin@ejemplo.com'),
      'juan@test.com'
    );

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await userEvent.type(passwordInputs[0], 'Pass123');
    await userEvent.type(passwordInputs[1], 'Pass123');

    await userEvent.type(searchInput, 'General');
    fireEvent.click(screen.getByText('Hospital General'));

    await userEvent.click(screen.getByText('Crear usuario de salud'));
    fireEvent.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() => {
      expect(createHealthUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Juan',
          email: 'juan@test.com',
          role_id: 2,
          hospital_ids: [1],
        })
      );
    });
    expect(toast.success).toHaveBeenCalledWith(
      'Usuario de salud creado correctamente.'
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows error toast on submission failure', async () => {
    (createHealthUser as jest.Mock).mockRejectedValue(new Error('API error'));
    render(<HealthUserCreationForm />);
    const searchInput =
      await screen.findByPlaceholderText('Buscar hospital...');

    await userEvent.type(screen.getByPlaceholderText('Jose Miguel'), 'Juan');
    await userEvent.type(screen.getByPlaceholderText('Perez'), 'López');
    await userEvent.type(
      screen.getByPlaceholderText('admin@ejemplo.com'),
      'juan@test.com'
    );

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await userEvent.type(passwordInputs[0], 'Pass123');
    await userEvent.type(passwordInputs[1], 'Pass123');

    await userEvent.type(searchInput, 'General');
    fireEvent.click(screen.getByText('Hospital General'));

    await userEvent.click(screen.getByText('Crear usuario de salud'));
    fireEvent.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error al crear el usuario. Intenta de nuevo.'
      );
    });
  });
});
