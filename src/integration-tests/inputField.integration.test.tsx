/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from '@/components/Input/inputField';

describe('InputField', () => {
  it('renders text variant', () => {
    render(<InputField variant="text" label="Nombre" />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('renders search variant with icon', () => {
    render(<InputField variant="search" />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders select variant', () => {
    const options = [
      { value: '1', label: 'Opción 1' },
      { value: '2', label: 'Opción 2' },
    ];
    render(
      <InputField
        variant="select"
        options={options}
        value="1"
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
  });

  it('renders select with medicine combobox', () => {
    const options = [
      { value: '1', label: 'Medicina A' },
      { value: '2', label: 'Medicina B' },
    ];
    const onChange = jest.fn();
    render(
      <InputField
        variant="select"
        options={options}
        placeholder="Buscar medicina..."
        isMedicine={true}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Buscar medicina...')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Buscar medicina...'));
    expect(screen.getByText('Medicina A')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Medicina A'));
    expect(onChange).toHaveBeenCalled();
  });

  it('renders description text', () => {
    render(<InputField variant="text" description="Descripción útil" />);
    expect(screen.getByText('Descripción útil')).toBeInTheDocument();
  });
});
