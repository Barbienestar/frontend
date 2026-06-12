/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from './login';

describe('Login', () => {
  describe('renderizado inicial', () => {
    it('muestra el título "Iniciar Sesión"', () => {
      // Arrange + Act
      render(<Login />);

      // Assert
      expect(
        screen.getByRole('heading', { name: /iniciar sesión/i })
      ).toBeInTheDocument();
    });

    it('muestra el campo de correo electrónico', () => {
      // Arrange + Act
      render(<Login />);

      // Assert
      expect(
        screen.getByPlaceholderText('ejemplo@salud.gob.mx')
      ).toBeInTheDocument();
    });

    it('muestra el campo de contraseña', () => {
      // Arrange + Act
      render(<Login />);

      // Assert
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('muestra el botón de submit con texto "Entrar al Sistema"', () => {
      // Arrange + Act
      render(<Login />);

      // Assert
      expect(
        screen.getByRole('button', { name: /entrar al sistema/i })
      ).toBeInTheDocument();
    });

    it('muestra el botón de Google', () => {
      // Arrange + Act
      render(<Login />);

      // Assert
      expect(
        screen.getByRole('button', { name: /google/i })
      ).toBeInTheDocument();
    });
  });

  describe('estado isLoading', () => {
    it('muestra "Ingresando..." en el botón de submit cuando isLoading=true', () => {
      // Arrange + Act
      render(<Login isLoading />);

      // Assert
      expect(
        screen.getByRole('button', { name: /ingresando/i })
      ).toBeInTheDocument();
    });

    it('deshabilita el botón de submit cuando isLoading=true', () => {
      // Arrange + Act
      render(<Login isLoading />);

      // Assert
      expect(
        screen.getByRole('button', { name: /ingresando/i })
      ).toBeDisabled();
    });

    it('muestra "Entrar al Sistema" cuando isLoading=false', () => {
      // Arrange + Act
      render(<Login isLoading={false} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /entrar al sistema/i })
      ).toBeInTheDocument();
    });
  });

  describe('estado isGoogleLoading', () => {
    it('muestra "Conectando..." en el botón de Google cuando isGoogleLoading=true', () => {
      // Arrange + Act
      render(<Login isGoogleLoading />);

      // Assert
      expect(
        screen.getByRole('button', { name: /conectando/i })
      ).toBeInTheDocument();
    });

    it('deshabilita el botón de Google cuando isGoogleLoading=true', () => {
      // Arrange + Act
      render(<Login isGoogleLoading />);

      // Assert
      expect(
        screen.getByRole('button', { name: /conectando/i })
      ).toBeDisabled();
    });

    it('muestra "Google" cuando isGoogleLoading=false', () => {
      // Arrange + Act
      render(<Login isGoogleLoading={false} />);

      // Assert
      expect(
        screen.getByRole('button', { name: /google/i })
      ).toBeInTheDocument();
    });
  });

  describe('submit del formulario', () => {
    it('llama a onSubmit con el email y password introducidos', () => {
      // Arrange
      const onSubmit = jest.fn();
      render(<Login onSubmit={onSubmit} />);

      // Act
      fireEvent.change(screen.getByPlaceholderText('ejemplo@salud.gob.mx'), {
        target: { value: 'usuario@test.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), {
        target: { value: 'micontraseña' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: /entrar al sistema/i })
      );

      // Assert
      expect(onSubmit).toHaveBeenCalledWith('usuario@test.com', 'micontraseña');
    });

    it('llama a onSubmit una sola vez al hacer submit', () => {
      // Arrange
      const onSubmit = jest.fn();
      render(<Login onSubmit={onSubmit} />);

      // Act
      fireEvent.click(
        screen.getByRole('button', { name: /entrar al sistema/i })
      );

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('no lanza error si onSubmit no está definido', () => {
      // Arrange
      render(<Login />);

      // Act + Assert
      expect(() => {
        fireEvent.click(
          screen.getByRole('button', { name: /entrar al sistema/i })
        );
      }).not.toThrow();
    });
  });

  describe('Google sign-in', () => {
    it('llama a onGoogleSignIn al hacer clic en el botón de Google', () => {
      // Arrange
      const onGoogleSignIn = jest.fn();
      render(<Login onGoogleSignIn={onGoogleSignIn} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: /google/i }));

      // Assert
      expect(onGoogleSignIn).toHaveBeenCalledTimes(1);
    });

    it('no lanza error si onGoogleSignIn no está definido', () => {
      // Arrange
      render(<Login />);

      // Act + Assert
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /google/i }));
      }).not.toThrow();
    });
  });
});
