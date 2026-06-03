import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, OverlayView } from '@react-google-maps/api';

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

const CDMX = { lat: 19.4326, lng: -99.1332 };

interface SidebarMapCardProps {
  selectedHospitalName?: string;
  isLoaded: boolean;
  onViewFullMap?: () => void;
}

export const SidebarMapCard = ({
  selectedHospitalName,
  isLoaded,
  onViewFullMap,
}: SidebarMapCardProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [hospitalPos, setHospitalPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Geolocalización al montar
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  // Geocodificar hospital seleccionado y mover el mapa
  useEffect(() => {
    if (!selectedHospitalName) {
      Promise.resolve().then(() => setHospitalPos(null));
      return;
    }
    if (!isLoaded || !window.google?.maps?.Geocoder) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: `${selectedHospitalName}, México` },
      (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const loc = results[0].geometry.location;
          setHospitalPos({ lat: loc.lat(), lng: loc.lng() });
        }
      }
    );
  }, [selectedHospitalName, isLoaded]);

  // Mover el mapa cuando cambia la posición del hospital o del usuario
  useEffect(() => {
    if (!mapRef.current) return;
    if (hospitalPos) {
      mapRef.current.panTo(hospitalPos);
      mapRef.current.setZoom(15);
    } else {
      const target = userPos ?? CDMX;
      mapRef.current.panTo(target);
      mapRef.current.setZoom(userPos ? 13 : 11);
    }
  }, [hospitalPos, userPos]);

  if (!isLoaded) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className="flex items-center justify-center bg-muted"
          style={{ height: '280px' }}
        >
          <p className="text-sm text-muted-foreground">Cargando mapa…</p>
        </div>
        <div className="p-3 border-t border-border">
          <button
            onClick={onViewFullMap}
            className="w-full text-sm font-medium text-primary flex items-center justify-center gap-1 hover:underline"
          >
            <MapPin className="size-3.5" />
            Ver Mapa de Abasto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <style>{`
        @keyframes sidebarUserPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.15; }
        }
        @keyframes sidebarHospitalPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.25; }
        }
      `}</style>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '280px' }}
        center={userPos ?? CDMX}
        zoom={userPos ? 13 : 11}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        }}
        onLoad={onMapLoad}
      >
        {/* Punto azul — ubicación del usuario */}
        {userPos && (
          <OverlayView
            position={userPos}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div style={{ position: 'relative', width: 0, height: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#93c5fd',
                  transform: 'translate(-50%, -50%)',
                  animation: 'sidebarUserPulse 2s ease-in-out infinite',
                }}
              />
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

        {/* Pin del hospital seleccionado */}
        {hospitalPos && (
          <OverlayView
            position={hospitalPos}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div style={{ position: 'relative', width: 0, height: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#fca5a5',
                  transform: 'translate(-50%, -50%)',
                  animation: 'sidebarHospitalPulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: '2.5px solid white',
                  boxShadow: '0 2px 6px rgba(239,68,68,0.5)',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>

      <div className="p-3 border-t border-border">
        <button
          onClick={onViewFullMap}
          className="w-full text-sm font-medium text-primary flex items-center justify-center gap-1 hover:underline"
        >
          <MapPin className="size-3.5" />
          Ver Mapa de Abasto
        </button>
      </div>
    </div>
  );
};
