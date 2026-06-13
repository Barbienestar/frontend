/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { CriticalMedicineCard } from './critical-medicine-card';

describe('CriticalMedicineCard', () => {
  it('renders medicineName, hospitalName, stock with piezas', () => {
    render(
      <CriticalMedicineCard
        hospitalName="Hospital General"
        medicineName="Paracetamol"
        stock={10}
      />
    );

    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
    expect(screen.getByText('10 piezas')).toBeInTheDocument();
  });

  it('renders red line when stock < 5', () => {
    const { container } = render(
      <CriticalMedicineCard
        hospitalName="Hospital A"
        medicineName="Ibuprofeno"
        stock={3}
      />
    );

    const line = container.querySelector('div > .bg-red-500');
    expect(line).toBeTruthy();
  });

  it('renders amber line when stock >= 5', () => {
    const { container } = render(
      <CriticalMedicineCard
        hospitalName="Hospital B"
        medicineName="Amoxicilina"
        stock={10}
      />
    );

    const line = container.querySelector('div > .bg-amber-500');
    expect(line).toBeTruthy();
  });
});
