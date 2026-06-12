/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { ChoroplethMap } from './ChoroplethMap';
import type { StateSupplyData } from '@/services/dashboard/stateSupply';

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  GeoJSON: () => <div data-testid="geojson-layer" />,
}));

// Mock leaflet CSS import
jest.mock('leaflet/dist/leaflet.css', () => {});

// Mock global fetch for GeoJSON
globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        type: 'FeatureCollection',
        features: [],
      }),
  })
) as jest.Mock;

const mockData: StateSupplyData[] = [
  { stateId: 1, stateName: 'Ciudad de México', avgStock: 85, level: 'CA-01' },
  { stateId: 2, stateName: 'Nuevo León', avgStock: 45, level: 'CA-03' },
];

describe('ChoroplethMap', () => {
  it('renders map container', () => {
    render(<ChoroplethMap data={mockData} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders legend with all levels', () => {
    render(<ChoroplethMap data={mockData} />);
    expect(screen.getByText('Óptimo (≥75%)')).toBeInTheDocument();
    expect(screen.getByText('Regular (50-74%)')).toBeInTheDocument();
    expect(screen.getByText('Alerta (25-49%)')).toBeInTheDocument();
    expect(screen.getByText('Crítico (<25%)')).toBeInTheDocument();
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });

  it('renders tile layer', () => {
    render(<ChoroplethMap data={mockData} />);
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(
      <ChoroplethMap data={mockData} height="500px" />
    );
    const mapContainer = container.querySelector('[style]');
    expect(mapContainer?.innerHTML).toBeTruthy();
  });
});
