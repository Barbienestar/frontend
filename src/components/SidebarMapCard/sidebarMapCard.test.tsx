/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarMapCard } from './sidebarMapCard';

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
}));

beforeEach(() => {
  jest.clearAllMocks();
  // Mock geolocation
  Object.defineProperty(globalThis.navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn((success) =>
        success({ coords: { latitude: 25.68, longitude: -100.31 } })
      ),
    },
    writable: true,
  });
});

describe('SidebarMapCard', () => {
  const onViewFullMap = jest.fn();

  it('shows loading state when not loaded', () => {
    render(<SidebarMapCard isLoaded={false} onViewFullMap={onViewFullMap} />);
    expect(screen.getByText('Cargando mapa…')).toBeInTheDocument();
  });

  it('renders "Ver Mapa de Abasto" button when not loaded', () => {
    render(<SidebarMapCard isLoaded={false} onViewFullMap={onViewFullMap} />);
    expect(screen.getByText('Ver Mapa de Abasto')).toBeInTheDocument();
  });

  it('calls onViewFullMap when button clicked', async () => {
    render(<SidebarMapCard isLoaded={false} onViewFullMap={onViewFullMap} />);
    await userEvent.click(screen.getByText('Ver Mapa de Abasto'));
    expect(onViewFullMap).toHaveBeenCalledTimes(1);
  });

  it('renders Google Map when loaded', () => {
    render(
      <SidebarMapCard
        isLoaded={true}
        selectedHospitalName="Hospital General"
        onViewFullMap={onViewFullMap}
      />
    );
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders button when loaded', () => {
    render(<SidebarMapCard isLoaded={true} onViewFullMap={onViewFullMap} />);
    expect(screen.getByText('Ver Mapa de Abasto')).toBeInTheDocument();
  });
});
