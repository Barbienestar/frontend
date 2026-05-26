import type { StockData } from './StockData';

export interface EnrichedStockData extends StockData {
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
}
