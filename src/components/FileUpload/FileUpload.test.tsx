/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

jest.mock('../ui/field', () => ({
  FieldLabel: () => <span data-testid="field-label" />,
}));

describe('FileUpload', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area with drag/drop text for receta variant', () => {
    render(<FileUpload variant="receta" />);
    expect(
      screen.getByText(
        'Arrastre la imagen de su receta aquí o explore archivos'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Formatos aceptados: JPG, PNG (Máx 5MB)')
    ).toBeInTheDocument();
  });

  it('renders different text for csv variant', () => {
    render(<FileUpload variant="csv" />);
    expect(screen.getByText('Arrastra tu archivo CSV')).toBeInTheDocument();
    expect(
      screen.getByText('Formato oficial de inventarios')
    ).toBeInTheDocument();
  });

  it('shows error state with error text', () => {
    render(<FileUpload variant="receta" error />);
    expect(screen.getByText('Este campo es obligatorio.')).toBeInTheDocument();
  });

  it('shows file name after file is selected', () => {
    render(
      <FileUpload
        variant="receta"
        onFileChange={onChange}
        testId="file-input"
      />
    );
    const input = screen.getByTestId('file-input');
    const file = new File(['content'], 'receta.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('receta.jpg')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('remove button clears file', () => {
    render(
      <FileUpload
        variant="receta"
        onFileChange={onChange}
        testId="file-input"
      />
    );
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, {
      target: {
        files: [new File([''], 'doc.pdf', { type: 'application/pdf' })],
      },
    });
    expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('doc.pdf')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('uses testId on hidden input', () => {
    render(<FileUpload variant="receta" testId="my-custom-input" />);
    expect(screen.getByTestId('my-custom-input')).toBeInTheDocument();
  });

  it('shows dragging state on dragOver', () => {
    render(<FileUpload variant="receta" />);
    const label = screen
      .getByText('Arrastre la imagen de su receta aquí o explore archivos')
      .closest('label')!;
    fireEvent.dragOver(label);
    expect(label.className).toContain('border-primary');
  });

  it('clears dragging state on dragLeave', () => {
    render(<FileUpload variant="receta" />);
    const label = screen
      .getByText('Arrastre la imagen de su receta aquí o explore archivos')
      .closest('label')!;
    fireEvent.dragOver(label);
    fireEvent.dragLeave(label);
    expect(label.className).toContain('border-muted-foreground');
  });

  it('handles drop event', () => {
    render(<FileUpload variant="receta" onFileChange={onChange} />);
    const file = new File(['content'], 'dropped.pdf', {
      type: 'application/pdf',
    });
    const label = screen
      .getByText('Arrastre la imagen de su receta aquí o explore archivos')
      .closest('label')!;
    fireEvent.drop(label, { dataTransfer: { files: [file] } });
    expect(screen.getByText('dropped.pdf')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('handles drop event with no file', () => {
    render(<FileUpload variant="receta" onFileChange={onChange} />);
    const label = screen
      .getByText('Arrastre la imagen de su receta aquí o explore archivos')
      .closest('label')!;
    fireEvent.drop(label, { dataTransfer: { files: [] } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
