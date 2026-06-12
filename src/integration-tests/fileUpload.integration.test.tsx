/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '@/components/FileUpload/FileUpload';

describe('FileUpload', () => {
  it('renders receta variant with default text', () => {
    render(<FileUpload variant="receta" />);
    expect(
      screen.getByText(/Arrastre la imagen de su receta aquí/)
    ).toBeInTheDocument();
  });

  it('renders csv variant', () => {
    render(<FileUpload variant="csv" />);
    expect(screen.getByText(/Arrastra tu archivo CSV/)).toBeInTheDocument();
  });

  it('shows selected file name', () => {
    const onFileChange = jest.fn();
    render(<FileUpload variant="receta" onFileChange={onFileChange} />);

    const file = new File(['dummy'], 'receta.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
    }
    expect(screen.getByText('receta.jpg')).toBeInTheDocument();
    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it('shows error state', () => {
    render(<FileUpload variant="receta" error={true} />);
    expect(screen.getByText('Este campo es obligatorio.')).toBeInTheDocument();
  });
});
