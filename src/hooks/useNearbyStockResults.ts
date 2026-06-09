import { useEffect, useState } from 'react';
import type { StockData } from '@/common/StockData';
import type { EnrichedStockData } from '@/common/EnrichedStockData';
import { haversineKm } from '@/utils/geo';

function geocodeWithGoogleMaps(
  geocoder: google.maps.Geocoder,
  queries: string[]
): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    const tryNext = (index: number) => {
      if (index >= queries.length) {
        resolve(null);
        return;
      }
      geocoder.geocode({ address: queries[index] }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          tryNext(index + 1);
        }
      });
    };
    tryNext(0);
  });
}

export function useNearbyStockResults(
  results: StockData[],
  userLat: number | null,
  userLng: number | null,
  isGoogleLoaded: boolean
) {
  // enrichedInternal solo guarda el último resultado geocodificado
  const [enrichedInternal, setEnrichedInternal] = useState<EnrichedStockData[]>(
    []
  );
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (
      results.length === 0 ||
      !isGoogleLoaded ||
      !globalThis.google?.maps?.Geocoder
    )
      return;

    const geocoder = new globalThis.google.maps.Geocoder();

    // setGeocoding dentro de una microtask para evitar setState síncrono en el efecto
    Promise.resolve().then(() => setGeocoding(true));

    Promise.all(
      results.map(async (r): Promise<EnrichedStockData> => {
        const queries = [
          `${r.hospitalName}, ${r.address}, México`,
          `${r.hospitalName}, México`,
          `${r.address}, México`,
        ];
        const coords = await geocodeWithGoogleMaps(geocoder, queries);
        const distanceKm =
          coords && userLat !== null && userLng !== null
            ? haversineKm(userLat, userLng, coords.lat, coords.lng)
            : null;
        return {
          ...r,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
          distanceKm,
        };
      })
    ).then((data) => {
      const sorted = [...data].sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
      setEnrichedInternal(sorted);
      setGeocoding(false);
    });
  }, [results, userLat, userLng, isGoogleLoaded]);

  // Estado derivado: si no hay resultados, siempre devuelve array vacío
  const enriched = results.length === 0 ? [] : enrichedInternal;

  return { enriched, geocoding };
}
