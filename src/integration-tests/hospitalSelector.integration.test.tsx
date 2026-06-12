/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { HospitalSelector } from '@/components/HospitalSelector/hospitalSelector';
import type { HospitalData } from '@/common/HospitalData';

const hospitals: HospitalData[] = [
  {
    id: 1,
    name: 'Hospital General',
  },
  {
    id: 2,
    name: 'Hospital de Especialidades',
  },
];

describe('HospitalSelector', () => {
  it('renders loading state', () => {
    const { container } = render(
      <HospitalSelector
        hospitals={[]}
        selected={null}
        onSelect={jest.fn()}
        loading={true}
      />
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders default text when no hospital selected', () => {
    render(
      <HospitalSelector
        hospitals={hospitals}
        selected={null}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText('Seleccionar hospital')).toBeInTheDocument();
  });

  it('shows selected hospital name', () => {
    render(
      <HospitalSelector
        hospitals={hospitals}
        selected={hospitals[0]}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
  });

  it('opens dropdown on click and selects hospital', () => {
    const onSelect = jest.fn();
    render(
      <HospitalSelector
        hospitals={hospitals}
        selected={null}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Seleccionar hospital'));
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
    expect(screen.getByText('Hospital de Especialidades')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hospital de Especialidades'));
    expect(onSelect).toHaveBeenCalledWith(hospitals[1]);
  });
});
