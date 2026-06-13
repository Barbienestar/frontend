/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from './inputField';

jest.mock('../ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="field">{children}</div>
  ),
  FieldLabel: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="field-label">{children}</span>
  ),
  FieldDescription: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="field-description">{children}</span>
  ),
}));

jest.mock('../ui/input', () => ({
  Input: (props: React.ComponentProps<'input'>) => <input {...props} />,
}));

describe('InputField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label text', () => {
    render(<InputField variant="text" label="Nombre" />);
    expect(screen.getByTestId('field-label')).toHaveTextContent('Nombre');
  });

  it('renders description text', () => {
    render(<InputField variant="text" description="Ingrese su nombre" />);
    expect(screen.getByTestId('field-description')).toHaveTextContent(
      'Ingrese su nombre'
    );
  });

  it('text variant renders input with testId', () => {
    render(<InputField variant="text" testId="text-input" />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('password variant renders input type="password"', () => {
    render(<InputField variant="password" testId="password-input" />);
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('search variant renders with search icon', () => {
    const { container } = render(<InputField variant="search" />);
    expect(container.querySelector('.lucide-search')).toBeInTheDocument();
  });

  it('select variant renders native select with options', () => {
    const options = [
      { value: '1', label: 'Opción 1' },
      { value: '2', label: 'Opción 2' },
    ];
    render(<InputField variant="select" options={options} />);
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
  });

  it('select + isMedicine renders custom combobox', () => {
    const options = [
      { value: '1', label: 'Paracetamol' },
      { value: '2', label: 'Ibuprofeno' },
    ];
    render(<InputField variant="select" options={options} isMedicine />);
    expect(screen.getByText('Choose an option...')).toBeInTheDocument();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Ibuprofeno')).toBeInTheDocument();
  });

  it('disabled variant has disabled input', () => {
    render(<InputField variant="text" testId="text-input" disabled />);
    expect(screen.getByTestId('text-input')).toBeDisabled();
  });
});
