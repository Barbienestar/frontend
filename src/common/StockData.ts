export interface StockData {
  hospitalId: number;
  hospitalName: string;
  address: string;
  stockLabel: string;
  status: 'Disponible' | 'Limitado' | 'Agotado';
  mapsUrl: string | null;
}
