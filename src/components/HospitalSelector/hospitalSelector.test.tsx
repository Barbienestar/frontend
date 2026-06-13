/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { HospitalSelector } from './hospitalSelector';
import type { HospitalData } from '@/common/HospitalData';

const mockHospitals: HospitalData[] = [
  { id: 1, name: 'Hospital General' },
  { id: 2, name: 'Hospital de Especialidades' },
  { id: 3, name: 'Hospital Infantil' },
];

describe('HospitalSelector', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows placeholder when no selection', () => {
    render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={null}
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('Seleccionar hospital')).toBeInTheDocument();
  });

  it('shows selected hospital name', () => {
    render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={mockHospitals[0]}
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    const { container } = render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={null}
        onSelect={onSelect}
        loading
      />
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={null}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Seleccionar hospital'));
    expect(screen.getByText('Mis hospitales')).toBeInTheDocument();
  });

  it('shows hospital names in dropdown', () => {
    render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={null}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Seleccionar hospital'));
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
    expect(screen.getByText('Hospital de Especialidades')).toBeInTheDocument();
    expect(screen.getByText('Hospital Infantil')).toBeInTheDocument();
  });

  it('selecting a hospital calls onSelect and closes dropdown', () => {
    render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={null}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Seleccionar hospital'));
    fireEvent.click(screen.getByText('Hospital de Especialidades'));
    expect(onSelect).toHaveBeenCalledWith(mockHospitals[1]);
    expect(screen.queryByText('Mis hospitales')).not.toBeInTheDocument();
  });

  it('shows checkmark on selected hospital', () => {
    const { container } = render(
      <HospitalSelector
        hospitals={mockHospitals}
        selected={mockHospitals[0]}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Hospital General'));
    expect(container.querySelector('.lucide-check')).toBeInTheDocument();
  });
});
