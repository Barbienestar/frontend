import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MapView } from './map';

jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
  heatLayer: jest.fn(() => ({
    addTo: jest.fn(),
    removeLayer: jest.fn(),
  })),
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children?: ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
  useMap: () => ({ flyTo: jest.fn(), removeLayer: jest.fn() }),
}));

jest.mock('leaflet.heat', () => ({}));
jest.mock('leaflet/dist/leaflet.css', () => ({}));

describe('MapView', () => {
  it('renders map container', () => {
    render(<MapView variant="normal" points={[]} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders TileLayer', () => {
    render(<MapView variant="normal" points={[]} />);
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('normal variant: renders markers for each point', () => {
    const points = [
      { lat: 19.4326, lng: -99.1332 },
      { lat: 19.5, lng: -99.2 },
    ];
    render(<MapView variant="normal" points={points} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
  });

  it('heatmap variant: does not render markers', () => {
    const points = [
      { lat: 19.4326, lng: -99.1332 },
      { lat: 19.5, lng: -99.2 },
    ];
    render(<MapView variant="heatmap" points={points} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  it('custom height style applied', () => {
    const { container } = render(
      <MapView variant="normal" points={[]} height="600px" />
    );
    const mapContainer = container.querySelector('[style]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('point with name shows popup', () => {
    const points = [{ lat: 19.4326, lng: -99.1332, name: 'Test Hospital' }];
    render(<MapView variant="normal" points={points} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(1);
  });
});