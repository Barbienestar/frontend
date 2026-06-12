/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { NearbyHospitalsMap } from './NearbyHospitalsMap';
import type { EnrichedStockData } from '@/common/EnrichedStockData';

const mockMap = {
  panTo: jest.fn(),
  setZoom: jest.fn(),
};

jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({
    children,
    onLoad,
  }: {
    children: React.ReactNode;
    onLoad?: (map: unknown) => void;
  }) => {
    if (onLoad) onLoad(mockMap);
    return <div data-testid="google-map">{children}</div>;
  },
  OverlayView: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="overlay-view">{children}</div>
  ),
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
}));

const mockResults: EnrichedStockData[] = [
  {
    hospitalId: 1,
    hospitalName: 'Hospital General',
    stockLabel: 'Disponible',
    status: 'Disponible',
    lat: 25.6866,
    lng: -100.3161,
    distanceKm: 2.5,
    mapsUrl: null,
    address: 'Centro',
  },
  {
    hospitalId: 2,
    hospitalName: 'Hospital Infantil',
    stockLabel: 'Agotado',
    status: 'Agotado',
    lat: 25.7,
    lng: -100.35,
    distanceKm: 5.0,
    mapsUrl: 'https://maps.google.com',
    address: 'Norte',
  },
];

describe('NearbyHospitalsMap', () => {
  const onSelectHospital = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when not loaded', () => {
    render(
      <NearbyHospitalsMap
        isLoaded={false}
        results={[]}
        selectedId={null}
        userLat={null}
        userLng={null}
        onSelectHospital={onSelectHospital}
      />
    );
    expect(screen.getByText('Cargando mapa…')).toBeInTheDocument();
  });

  it('renders map when loaded', () => {
    render(
      <NearbyHospitalsMap
        isLoaded={true}
        results={mockResults}
        selectedId={null}
        userLat={25.68}
        userLng={-100.31}
        onSelectHospital={onSelectHospital}
      />
    );
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders legend', () => {
    render(
      <NearbyHospitalsMap
        isLoaded={true}
        results={mockResults}
        selectedId={null}
        userLat={25.68}
        userLng={-100.31}
        onSelectHospital={onSelectHospital}
      />
    );
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByText('Escaso')).toBeInTheDocument();
    expect(screen.getByText('No hay existencias')).toBeInTheDocument();
    expect(screen.getByText('Tu ubicación')).toBeInTheDocument();
  });
});
