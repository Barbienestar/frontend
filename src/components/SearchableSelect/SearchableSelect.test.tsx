/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { SearchableSelect } from './SearchableSelect';

const options = [
  { value: '1', label: 'Ciudad de México' },
  { value: '2', label: 'Estado de México' },
  { value: '3', label: 'Nuevo León' },
];

describe('SearchableSelect', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChange}
        placeholder="Selecciona un estado"
      />
    );
    expect(
      screen.getByPlaceholderText('Selecciona un estado')
    ).toBeInTheDocument();
  });

  it('shows selected value when closed', () => {
    render(
      <SearchableSelect options={options} value="2" onChange={onChange} />
    );
    expect(screen.getByDisplayValue('Estado de México')).toBeInTheDocument();
  });

  it('opens dropdown on focus', () => {
    render(<SearchableSelect options={options} value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(screen.getByText('Ciudad de México')).toBeInTheDocument();
    expect(screen.getByText('Estado de México')).toBeInTheDocument();
    expect(screen.getByText('Nuevo León')).toBeInTheDocument();
  });

  it('filters options based on query', () => {
    render(<SearchableSelect options={options} value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'México' } });
    expect(screen.getByText('Ciudad de México')).toBeInTheDocument();
    expect(screen.getByText('Estado de México')).toBeInTheDocument();
    expect(screen.queryByText('Nuevo León')).not.toBeInTheDocument();
  });

  it('calls onChange when option selected', () => {
    render(<SearchableSelect options={options} value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText('Nuevo León'));
    expect(onChange).toHaveBeenCalledWith('3');
  });

  it('shows "Sin resultados" when no match', () => {
    render(<SearchableSelect options={options} value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzzz' } });
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('closes dropdown on outside click', () => {
    render(<SearchableSelect options={options} value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(screen.getByText('Ciudad de México')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Ciudad de México')).not.toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChange}
        label="Estado"
      />
    );
    expect(screen.getByText('Estado')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChange}
        description="Selecciona tu estado"
      />
    );
    expect(screen.getByText('Selecciona tu estado')).toBeInTheDocument();
  });

  it('disables input when disabled', () => {
    render(
      <SearchableSelect
        options={options}
        value=""
        onChange={onChange}
        disabled
      />
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
