/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './signup';
import { getAllStates } from '@/services/states/statesService';
import { getCitiesByState } from '@/services/cities/citiesService';
import { getSuburbsByCity } from '@/services/suburbs/suburbsService';
import { signup } from '@/services/auth/authService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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
jest.mock('@/services/auth/authService', () => ({
  signup: jest.fn(),
}));

const mockStates = [
  { id: 1, name: 'Jalisco' },
  { id: 2, name: 'Ciudad de México' },
];
const mockCities = [{ id: 10, name: 'Guadalajara' }];
const mockSuburbs = [{ id: 100, zipCode: '44100', name: 'Centro' }];

describe('SignUp', () => {
  beforeEach(() => {
    (getAllStates as jest.Mock).mockResolvedValue(mockStates);
    (getCitiesByState as jest.Mock).mockResolvedValue(mockCities);
    (getSuburbsByCity as jest.Mock).mockResolvedValue(mockSuburbs);
    (signup as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helpers
  const getStateSelect = (container: HTMLElement) =>
    container.querySelector<HTMLSelectElement>('select[name="stateId"]')!;
  const getCitySelect = (container: HTMLElement) =>
    container.querySelector<HTMLSelectElement>('select[name="cityId"]')!;
  const getSuburbSelect = (container: HTMLElement) =>
    container.querySelector<HTMLSelectElement>('select[name="idSuburb"]')!;

  const selectState = async (container: HTMLElement) => {
    await screen.findByRole('option', { name: 'JALISCO' });
    fireEvent.change(getStateSelect(container), { target: { value: '1' } });
  };

  const selectCity = async (container: HTMLElement) => {
    await screen.findByRole('option', { name: 'GUADALAJARA' });
    fireEvent.change(getCitySelect(container), { target: { value: '10' } });
  };

  const selectSuburb = async (container: HTMLElement) => {
    await screen.findByRole('option', { name: '44100 - CENTRO' });
    fireEvent.change(getSuburbSelect(container), { target: { value: '100' } });
  };

  const fillTextFields = () => {
    fireEvent.change(screen.getByPlaceholderText('Jose Miguel'), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Perez'), {
      target: { value: 'García' },
    });
    fireEvent.change(screen.getByPlaceholderText('jmperez@gmail.com'), {
      target: { value: 'juan@test.com' },
    });
    const [passwordInput, confirmInput] =
      screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
    fireEvent.change(confirmInput, { target: { value: 'Password1' } });
    fireEvent.change(screen.getByPlaceholderText('24'), {
      target: { value: '25' },
    });
  };

  // ──────────────────────────────────────────────
  describe('renderizado inicial', () => {
    it('muestra el título "Crear cuenta"', () => {
      // Arrange + Act
      render(<SignUp />);

      // Assert
      expect(
        screen.getByRole('heading', { name: /crear cuenta/i })
      ).toBeInTheDocument();
    });

    it('muestra los campos de texto principales', () => {
      // Arrange + Act
      render(<SignUp />);

      // Assert
      expect(screen.getByPlaceholderText('Jose Miguel')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Perez')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('jmperez@gmail.com')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('24')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    });

    it('llama a getAllStates al montar', async () => {
      // Arrange + Act
      render(<SignUp />);

      // Assert
      await waitFor(() => {
        expect(getAllStates).toHaveBeenCalledTimes(1);
      });
    });

    it('no muestra el select de ciudad al montar', async () => {
      // Arrange
      const { container } = render(<SignUp />);
      await screen.findByRole('option', { name: 'JALISCO' });

      // Assert
      expect(getCitySelect(container)).not.toBeInTheDocument();
    });

    it('no muestra el select de localidad al montar', async () => {
      // Arrange
      const { container } = render(<SignUp />);
      await screen.findByRole('option', { name: 'JALISCO' });

      // Assert
      expect(getSuburbSelect(container)).not.toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────
  describe('carga de estados', () => {
    it('popula el select de estado con las opciones recibidas', async () => {
      // Arrange + Act
      render(<SignUp />);

      // Assert
      expect(
        await screen.findByRole('option', { name: 'JALISCO' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'CIUDAD DE MÉXICO' })
      ).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────
  describe('cascada estado → ciudad', () => {
    it('llama a getCitiesByState con el id del estado seleccionado', async () => {
      // Arrange
      const { container } = render(<SignUp />);

      // Act
      await selectState(container);

      // Assert
      await waitFor(() => {
        expect(getCitiesByState).toHaveBeenCalledWith(1);
      });
    });

    it('muestra el select de ciudad después de seleccionar un estado', async () => {
      // Arrange
      const { container } = render(<SignUp />);

      // Act
      await selectState(container);

      // Assert
      expect(
        await screen.findByRole('option', { name: 'GUADALAJARA' })
      ).toBeInTheDocument();
    });

    it('oculta el select de ciudad y localidad al cambiar de estado', async () => {
      // Arrange
      const { container } = render(<SignUp />);
      await selectState(container);
      await selectCity(container);
      await screen.findByRole('option', { name: '44100 - CENTRO' });

      // Act — seleccionar un estado diferente resetea las dependencias
      fireEvent.change(getStateSelect(container), { target: { value: '2' } });

      // Assert
      await waitFor(() => {
        expect(getSuburbSelect(container)).not.toBeInTheDocument();
      });
    });
  });

  // ──────────────────────────────────────────────
  describe('cascada ciudad → localidad', () => {
    it('llama a getSuburbsByCity con el id de la ciudad seleccionada', async () => {
      // Arrange
      const { container } = render(<SignUp />);
      await selectState(container);

      // Act
      await selectCity(container);

      // Assert
      await waitFor(() => {
        expect(getSuburbsByCity).toHaveBeenCalledWith(10);
      });
    });

    it('muestra el select de localidad después de seleccionar una ciudad', async () => {
      // Arrange
      const { container } = render(<SignUp />);
      await selectState(container);

      // Act
      await selectCity(container);

      // Assert
      expect(
        await screen.findByRole('option', { name: '44100 - CENTRO' })
      ).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────
  describe('validaciones', () => {
    it('muestra error cuando el nombre está vacío al salir del campo', async () => {
      // Arrange
      render(<SignUp />);

      // Act
      fireEvent.blur(screen.getByPlaceholderText('Jose Miguel'));

      // Assert
      expect(
        await screen.findByText('El nombre es obligatorio')
      ).toBeInTheDocument();
    });

    it('muestra error de formato cuando el email es inválido', async () => {
      // Arrange
      render(<SignUp />);

      // Act
      const emailInput = screen.getByPlaceholderText('jmperez@gmail.com');
      fireEvent.change(emailInput, { target: { value: 'no-es-email' } });
      fireEvent.blur(emailInput);

      // Assert
      expect(await screen.findByText('Formato inválido')).toBeInTheDocument();
    });

    it('muestra error cuando la contraseña no cumple el patrón de seguridad', async () => {
      // Arrange
      render(<SignUp />);

      // Act
      const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
      fireEvent.change(passwordInput, { target: { value: 'sinmayuscula1' } });
      fireEvent.blur(passwordInput);

      // Assert
      expect(
        await screen.findByText('Debe incluir Mayús, minús y número')
      ).toBeInTheDocument();
    });

    it('muestra error cuando las contraseñas no coinciden', async () => {
      // Arrange
      render(<SignUp />);

      // Act
      const [passwordInput, confirmInput] =
        screen.getAllByPlaceholderText('••••••••');
      fireEvent.change(passwordInput, { target: { value: 'Password1' } });
      fireEvent.change(confirmInput, { target: { value: 'Diferente1' } });
      fireEvent.blur(confirmInput);

      // Assert
      expect(
        await screen.findByText('Los passwords no coinciden')
      ).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────
  describe('submit', () => {
    const fillAndSubmit = async (container: HTMLElement) => {
      fillTextFields();
      await selectState(container);
      await selectCity(container);
      await selectSuburb(container);
      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    };

    it('llama a signup con los datos correctos', async () => {
      // Arrange
      const { container } = render(<SignUp />);

      // Act
      await fillAndSubmit(container);

      // Assert
      await waitFor(() => {
        expect(signup).toHaveBeenCalledWith({
          name: 'Juan',
          last_name_1: 'García',
          last_name_2: undefined,
          email: 'juan@test.com',
          password: 'Password1',
          age: 25,
          suburbId: 100,
          roleId: 3,
        });
      });
    });

    it('navega a /reportar tras el signup exitoso', async () => {
      // Arrange
      const { container } = render(<SignUp />);

      // Act
      await fillAndSubmit(container);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/reportar', {
          replace: true,
        });
      });
    });

    it('no navega si signup lanza un error', async () => {
      // Arrange
      (signup as jest.Mock).mockRejectedValue(new Error('Error de red'));
      const { container } = render(<SignUp />);

      // Act
      await fillAndSubmit(container);
      await waitFor(() => expect(signup).toHaveBeenCalled());

      // Assert
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
