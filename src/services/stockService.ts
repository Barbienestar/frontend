import api from './api';
import type { StockData } from '@/common/StockData';
import type { MedicineSearchResult } from '@/common/MedicineSearchResult';

export const getStockByMedicine = async (
  query: string
): Promise<StockData[]> => {
  const res = await api.get<StockData[]>('/medicines-hospitals/stock', {
    params: { medicineName: query },
  });
  return res.data;
};

export const searchMedicines = async (
  q: string
): Promise<MedicineSearchResult[]> => {
  const res = await api.get<MedicineSearchResult[]>('/medicines', {
    params: { q },
  });
  return res.data;
};
