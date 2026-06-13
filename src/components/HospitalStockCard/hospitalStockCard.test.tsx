/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import HospitalStockCard from './hospitalStockCard';
import type { StockData } from '@/common/StockData';

jest.mock('@/components/StatusBadge/StatusBadge', () => ({
  __esModule: true,
  default: ({ variant }: { variant: string }) => (
    <span data-testid="status-badge">{variant}</span>
  ),
}));

jest.mock('@/components/Button/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/utils/geo', () => ({
  formatDistance: (km: number) => `A ${km.toFixed(1)} km`,
}));

const baseData: StockData = {
  hospitalId: 1,
  hospitalName: 'Hospital General',
  address: 'Av. Reforma 123',
  stockLabel: '15 disponibles',
  status: 'Disponible',
  mapsUrl: 'https://maps.google.com/?q=Hospital+General',
};

describe('HospitalStockCard', () => {
  const onClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hospitalName and address', () => {
    render(<HospitalStockCard data={baseData} medicineName="Paracetamol" />);
    expect(screen.getByText('Hospital General')).toBeInTheDocument();
    expect(screen.getByText('Av. Reforma 123')).toBeInTheDocument();
  });

  it('renders medicineName', () => {
    render(<HospitalStockCard data={baseData} medicineName="Paracetamol" />);
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
  });

  it('shows distance when distanceKm is provided', () => {
    const dataWithDistance = { ...baseData, distanceKm: 3.5 };
    render(
      <HospitalStockCard data={dataWithDistance} medicineName="Paracetamol" />
    );
    expect(screen.getByText('A 3.5 km')).toBeInTheDocument();
  });

  it('shows Ubicación no disponible when mapsUrl is null', () => {
    const dataNoUrl = { ...baseData, mapsUrl: null };
    render(<HospitalStockCard data={dataNoUrl} medicineName="Paracetamol" />);
    expect(screen.getByText('Ubicación no disponible')).toBeInTheDocument();
  });

  it('shows Cómo llegar button when mapsUrl exists', () => {
    render(<HospitalStockCard data={baseData} medicineName="Paracetamol" />);
    expect(screen.getByText('Cómo llegar')).toBeInTheDocument();
  });

  it('has role="button" and onClick handler', () => {
    render(
      <HospitalStockCard
        data={baseData}
        medicineName="Paracetamol"
        onClick={onClick}
      />
    );
    const cards = screen.getAllByRole('button');
    expect(cards[0]).toBeInTheDocument();
  });

  it('shows selected styles when selected=true', () => {
    const { container } = render(
      <HospitalStockCard
        data={baseData}
        medicineName="Paracetamol"
        selected
        onClick={onClick}
      />
    );
    expect(container.querySelector('.ring-primary')).toBeInTheDocument();
  });

  it('calls onClick on Enter key', () => {
    render(
      <HospitalStockCard
        data={baseData}
        medicineName="Paracetamol"
        onClick={onClick}
      />
    );
    const card = screen
      .getByText('Hospital General')
      .closest('[role="button"]')!;
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Space key', () => {
    render(
      <HospitalStockCard
        data={baseData}
        medicineName="Paracetamol"
        onClick={onClick}
      />
    );
    const card = screen
      .getByText('Hospital General')
      .closest('[role="button"]')!;
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
