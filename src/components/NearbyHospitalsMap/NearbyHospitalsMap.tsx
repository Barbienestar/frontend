import {
  GoogleMap,
  OverlayView,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { EnrichedStockData } from '@/common/EnrichedStockData';
import { Clock, Navigation, Car, X } from 'lucide-react';

const STATUS_COLORS: Record<string, { fill: string; ring: string }> = {
  Disponible: { fill: '#22c55e', ring: '#bbf7d0' },
  Limitado: { fill: '#f59e0b', ring: '#fde68a' },
  Agotado: { fill: '#ef4444', ring: '#fecaca' },
};

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f8fafc' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#e2e8f0' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#cbd5e1' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#94a3b8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#64748b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#bfdbfe' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dcfce7' }],
  },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

interface HospitalMarkerProps {
  data: EnrichedStockData;
  selected: boolean;
  onClick: () => void;
}

function HospitalMarker({
  data,
  selected,
  onClick,
}: Readonly<HospitalMarkerProps>) {
  const colors = STATUS_COLORS[data.status] ?? {
    fill: '#94a3b8',
    ring: '#e2e8f0',
  };
  const size = selected ? 22 : 16;
  const ringSize = size + 10;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        position: 'relative',
        width: ringSize,
        height: ringSize,
        cursor: 'pointer',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: colors.ring,
          opacity: selected ? 1 : 0.6,
          animation: selected
            ? 'markerPulse 1.5s ease-in-out infinite'
            : undefined,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          backgroundColor: colors.fill,
          border: '2.5px solid white',
          boxShadow: `0 2px 8px ${colors.fill}99`,
        }}
      />
    </div>
  );
}

const LEGEND = [
  { label: 'Disponible', color: '#22c55e' },
  { label: 'Escaso', color: '#f59e0b' },
  { label: 'No hay existencias', color: '#ef4444' },
];

interface RouteInfo {
  distance: string;
  duration: string;
  hospitalName: string;
  mapsUrl: string | null;
  hospitalLat: number;
  hospitalLng: number;
}

interface NearbyHospitalsMapProps {
  isLoaded: boolean;
  results: EnrichedStockData[];
  selectedId: number | null;
  userLat: number | null;
  userLng: number | null;
  onSelectHospital: (id: number) => void;
  height?: string;
}

export function NearbyHospitalsMap({
  isLoaded,
  results,
  selectedId,
  userLat,
  userLng,
  onSelectHospital,
  height = '520px',
}: Readonly<NearbyHospitalsMapProps>) {
  const mapRef = useRef<google.maps.Map | null>(null);
  // Guardamos id junto al resultado para derivar si sigue vigente
  const [routeForId, setRouteForId] = useState<{
    id: number;
    directions: google.maps.DirectionsResult | null;
    info: RouteInfo;
    error: boolean;
  } | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current || userLat === null || userLng === null) return;
    mapRef.current.panTo({ lat: userLat, lng: userLng });
    mapRef.current.setZoom(12);
  }, [userLat, userLng]);

  useEffect(() => {
    if (!selectedId || !isLoaded) return;

    const hospital = results.find((r) => r.hospitalId === selectedId);
    if (!hospital || hospital.lat == null || hospital.lng == null) return;

    const hLat: number = hospital.lat;
    const hLng: number = hospital.lng;

    if (mapRef.current) {
      mapRef.current.panTo({ lat: hLat, lng: hLng });
      mapRef.current.setZoom(14);
    }

    if (userLat === null || userLng === null) return;

    const service = new globalThis.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: userLat, lng: userLng },
        destination: { lat: hLat, lng: hLng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          const leg = result.routes[0]?.legs[0];
          setRouteForId({
            id: selectedId,
            directions: result,
            error: false,
            info: {
              distance: leg?.distance?.text ?? '',
              duration: leg?.duration?.text ?? '',
              hospitalName: hospital.hospitalName,
              mapsUrl: hospital.mapsUrl,
              hospitalLat: hLat,
              hospitalLng: hLng,
            },
          });
        } else {
          setRouteForId({
            id: selectedId,
            directions: null,
            error: true,
            info: {
              distance: hospital.distanceKm
                ? `~${hospital.distanceKm.toFixed(1)} km`
                : '',
              duration: '',
              hospitalName: hospital.hospitalName,
              mapsUrl: hospital.mapsUrl,
              hospitalLat: hLat,
              hospitalLng: hLng,
            },
          });
        }
      }
    );
  }, [selectedId, isLoaded, userLat, userLng, results]);

  // Derivado: solo mostrar si corresponde al hospital seleccionado actualmente
  const activeRoute = routeForId?.id === selectedId ? routeForId : null;
  const directions = activeRoute?.directions ?? null;
  const routeInfo = activeRoute?.info ?? null;
  const directionsError = activeRoute?.error ?? false;

  const fallbackMapsUrl = (lat: number, lng: number) =>
    userLat !== null && userLng !== null
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-xl border border-border"
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">Cargando mapa…</p>
      </div>
    );
  }

  const initialCenter =
    userLat !== null && userLng !== null
      ? { lat: userLat, lng: userLng }
      : { lat: 19.4326, lng: -99.1332 };

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-border"
      style={{ height }}
    >
      <style>{`
        @keyframes markerPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0.25; }
        }
        @keyframes userPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.8); opacity: 0.15; }
        }
      `}</style>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={initialCenter}
        zoom={userLat == null ? 11 : 12}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        }}
        onLoad={onMapLoad}
        onClick={() => setRouteForId(null)}
      >
        {/* Ruta */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Punto azul — ubicación del usuario */}
        {userLat !== null && userLng !== null && (
          <OverlayView
            position={{ lat: userLat, lng: userLng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div style={{ position: 'relative', width: 0, height: 0 }}>
              {/* Halo */}
              <div
                style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#93c5fd',
                  transform: 'translate(-50%, -50%)',
                  animation: 'userPulse 2s ease-in-out infinite',
                }}
              />
              {/* Punto */}
              <div
                style={{
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(37,99,235,0.5)',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </OverlayView>
        )}

        {/* Marcadores de hospitales */}
        {results.map((r) => {
          if (r.lat === null || r.lng === null) return null;
          return (
            <OverlayView
              key={r.hospitalId}
              position={{ lat: r.lat, lng: r.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <HospitalMarker
                data={r}
                selected={selectedId === r.hospitalId}
                onClick={() => onSelectHospital(r.hospitalId)}
              />
            </OverlayView>
          );
        })}
      </GoogleMap>

      {/* Panel de ruta */}
      {routeInfo && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-card/95 backdrop-blur-sm border border-border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 max-w-[380px] w-[calc(100%-24px)]">
          <Car className="size-4 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {routeInfo.hospitalName}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {routeInfo.duration && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {routeInfo.duration}
                </span>
              )}
              {routeInfo.distance && (
                <>
                  {routeInfo.duration && (
                    <span className="text-xs text-muted-foreground">·</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {routeInfo.distance}
                  </span>
                </>
              )}
              {directionsError && (
                <span className="text-xs text-amber-500">
                  Habilita Directions API para tiempo exacto
                </span>
              )}
            </div>
          </div>
          <a
            href={
              routeInfo.mapsUrl ??
              fallbackMapsUrl(routeInfo.hospitalLat, routeInfo.hospitalLng)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <Navigation className="size-3" />
            Ir
          </a>
          <button
            onClick={() => setRouteForId(null)}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-3 left-3 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs flex flex-col gap-1.5 shadow">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
          Simbología
        </p>
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="size-3 rounded-full inline-block shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-foreground">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-0.5 pt-1 border-t border-border">
          <span className="size-3 rounded-full inline-block shrink-0 bg-blue-600" />
          <span className="text-muted-foreground">Tu ubicación</span>
        </div>
      </div>
    </div>
  );
}
