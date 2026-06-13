/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MedicineAutocomplete from './medicineAutocomplete';

jest.mock('@/services/stock/stockService', () => ({
  searchMedicines: jest.fn(),
}));

import { searchMedicines } from '@/services/stock/stockService';

const mockSuggestions = [
  {
    id: 1,
    genericName: 'Paracetamol',
    dosageForm: 'Tableta',
    strength: '500mg',
    presentation: 'Caja',
  },
  {
    id: 2,
    genericName: 'Ibuprofeno',
    dosageForm: 'Cápsula',
    strength: '400mg',
    presentation: 'Blister',
  },
];

describe('MedicineAutocomplete', () => {
  const onChange = jest.fn();
  const onSelect = jest.fn();
  const onSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders input with testId', () => {
    render(
      <MedicineAutocomplete
        value=""
        onChange={onChange}
        onSelect={onSelect}
        onSearch={onSearch}
      />
    );
    expect(screen.getByTestId('medicines-search-input')).toBeInTheDocument();
  });

  it('renders placeholder Metformina 850mg', () => {
    render(
      <MedicineAutocomplete
        value=""
        onChange={onChange}
        onSelect={onSelect}
        onSearch={onSearch}
      />
    );
    expect(screen.getByPlaceholderText('Metformina 850mg')).toBeInTheDocument();
  });

  it('shows suggestions when value.length >= 2 and suggestions exist', async () => {
    (searchMedicines as jest.Mock).mockResolvedValue(mockSuggestions);

    render(
      <MedicineAutocomplete
        value="Pa"
        onChange={onChange}
        onSelect={onSelect}
        onSearch={onSearch}
      />
    );

    const input = screen.getByTestId('medicines-search-input');
    fireEvent.focus(input);
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getAllByTestId('medicines-suggestion-text').length).toBe(2);
    });
  });

  it('hides suggestions when no suggestions exist', () => {
    render(
      <MedicineAutocomplete
        value="P"
        onChange={onChange}
        onSelect={onSelect}
        onSearch={onSearch}
      />
    );

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('input disabled when isLoading', () => {
    render(
      <MedicineAutocomplete
        value=""
        onChange={onChange}
        onSelect={onSelect}
        onSearch={onSearch}
        isLoading
      />
    );
    expect(screen.getByTestId('medicines-search-input')).toBeDisabled();
  });

  it('calls onSearch on Enter key', () => {
    render(
      <MedicineAutocomplete
        value="Paracetamol"
        onChange={onChange}
        onSelect={onSelect}
        onSearch={onSearch}
      />
    );
    fireEvent.keyDown(screen.getByTestId('medicines-search-input'), {
      key: 'Enter',
    });
    expect(onSearch).toHaveBeenCalledWith('Paracetamol');
  });
});
