/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminCreationForm } from './AdminCreationForm';
import { createAdmin } from '@/services/user/createUserService';
import { toast } from 'sonner';

jest.mock('@/services/user/createUserService', () => ({
  createAdmin: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../ConfirmModal/ConfirmModal', () => ({
  ConfirmModal: ({
    isOpen,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => {
    if (!isOpen) return null;
    return (
      <div role="dialog">
        <button onClick={onConfirm}>{confirmLabel}</button>
        <button onClick={onCancel}>{cancelLabel}</button>
      </div>
    );
  },
}));

const fillValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Jose Miguel'), {
    target: { value: 'Juan' },
  });
  fireEvent.change(screen.getByPlaceholderText('Perez'), {
    target: { value: 'Pérez' },
  });
  fireEvent.change(screen.getByPlaceholderText('admin@ejemplo.com'), {
    target: { value: 'admin@test.com' },
  });
  const [passwordInput, confirmInput] =
    screen.getAllByPlaceholderText('••••••••');
  fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  fireEvent.change(confirmInput, { target: { value: 'Password1' } });
};

describe('AdminCreationForm', () => {
  beforeEach(() => {
    (createAdmin as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado inicial', () => {
    it('muestra el título "Crear Administrador"', () => {
      // Arrange
      render(<AdminCreationForm />);

      // Assert
      expect(screen.getByText('Crear Administrador')).toBeInTheDocument();
    });

    it('renderiza todos los campos del formulario', () => {
      // Arrange
      render(<AdminCreationForm />);

      // Assert
      expect(screen.getByPlaceholderText('Jose Miguel')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Perez')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Marquez')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('admin@ejemplo.com')
      ).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    });

    it('no muestra el modal de confirmación al montar', () => {
      // Arrange
      render(<AdminCreationForm />);

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('validaciones', () => {
    it('muestra error cuando el nombre está vacío al salir del campo', async () => {
      // Arrange
      render(<AdminCreationForm />);

      // Act
      fireEvent.blur(screen.getByPlaceholderText('Jose Miguel'));

      // Assert
      expect(
        await screen.findByText('El nombre es obligatorio')
      ).toBeInTheDocument();
    });

    it('muestra error cuando el apellido paterno está vacío al salir del campo', async () => {
      // Arrange
      render(<AdminCreationForm />);

      // Act
      fireEvent.blur(screen.getByPlaceholderText('Perez'));

      // Assert
      expect(
        await screen.findByText('El apellido paterno es obligatorio')
      ).toBeInTheDocument();
    });

    it('muestra error de formato cuando el email es inválido', async () => {
      // Arrange
      render(<AdminCreationForm />);

      // Act
      fireEvent.change(screen.getByPlaceholderText('admin@ejemplo.com'), {
        target: { value: 'no-es-un-email' },
      });
      fireEvent.blur(screen.getByPlaceholderText('admin@ejemplo.com'));

      // Assert
      expect(await screen.findByText('Formato inválido')).toBeInTheDocument();
    });

    it('muestra error cuando la contraseña tiene menos de 6 caracteres', async () => {
      // Arrange
      render(<AdminCreationForm />);
      const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];

      // Act
      fireEvent.change(passwordInput, { target: { value: 'Ab1' } });
      fireEvent.blur(passwordInput);

      // Assert
      expect(
        await screen.findByText('Mínimo 6 caracteres')
      ).toBeInTheDocument();
    });

    it('muestra error cuando la contraseña no cumple el patrón de seguridad', async () => {
      // Arrange
      render(<AdminCreationForm />);
      const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];

      // Act
      fireEvent.change(passwordInput, { target: { value: 'sinmayuscula1' } });
      fireEvent.blur(passwordInput);

      // Assert
      expect(
        await screen.findByText('Debe incluir mayúscula, minúscula y número')
      ).toBeInTheDocument();
    });

    it('muestra error cuando las contraseñas no coinciden', async () => {
      // Arrange
      render(<AdminCreationForm />);
      const [passwordInput, confirmInput] =
        screen.getAllByPlaceholderText('••••••••');

      // Act
      fireEvent.change(passwordInput, { target: { value: 'Password1' } });
      fireEvent.change(confirmInput, { target: { value: 'OtraPassword1' } });
      fireEvent.blur(confirmInput);

      // Assert
      expect(
        await screen.findByText('Los passwords no coinciden')
      ).toBeInTheDocument();
    });
  });

  describe('apertura del modal', () => {
    it('abre el modal de confirmación al hacer submit', () => {
      // Arrange
      render(<AdminCreationForm />);
      fillValidForm();

      // Act
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('no llama a createAdmin al abrir el modal', () => {
      // Arrange
      render(<AdminCreationForm />);
      fillValidForm();

      // Act
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Assert
      expect(createAdmin).not.toHaveBeenCalled();
    });
  });

  describe('cancelar modal', () => {
    it('no llama a createAdmin cuando se cancela el modal', () => {
      // Arrange
      render(<AdminCreationForm />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      // Assert
      expect(createAdmin).not.toHaveBeenCalled();
    });
  });

  describe('flujo exitoso', () => {
    it('llama a createAdmin con los datos correctos al confirmar', async () => {
      // Arrange
      render(<AdminCreationForm />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /sí, crear/i }));

      // Assert
      await waitFor(() => {
        expect(createAdmin).toHaveBeenCalledWith({
          name: 'Juan',
          last_name_1: 'Pérez',
          last_name_2: undefined,
          email: 'admin@test.com',
          password: 'Password1',
          role_id: 1,
        });
      });
    });

    it('llama a toast.success tras crear el administrador', async () => {
      // Arrange
      render(<AdminCreationForm />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /sí, crear/i }));

      // Assert
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Usuario administrador creado correctamente.'
        );
      });
    });

    it('llama a onSuccess tras crear el administrador', async () => {
      // Arrange
      const onSuccess = jest.fn();
      render(<AdminCreationForm onSuccess={onSuccess} />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /sí, crear/i }));

      // Assert
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('resetea el formulario tras el éxito', async () => {
      // Arrange
      render(<AdminCreationForm />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /sí, crear/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Jose Miguel')).toHaveValue('');
      });
    });
  });

  describe('error en API', () => {
    it('muestra toast.error cuando createAdmin lanza un error', async () => {
      // Arrange
      (createAdmin as jest.Mock).mockRejectedValue(new Error('Server error'));
      render(<AdminCreationForm />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /sí, crear/i }));

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Error al crear el usuario. Intenta de nuevo.'
        );
      });
    });
  });

  describe('estado de envío', () => {
    it('deshabilita el botón y muestra "Creando..." mientras se procesa', async () => {
      // Arrange
      (createAdmin as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );
      render(<AdminCreationForm />);
      fillValidForm();
      fireEvent.click(
        screen.getByRole('button', { name: /crear administrador/i })
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /sí, crear/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /creando/i })).toBeDisabled();
      });
    });
  });
});
