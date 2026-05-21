export interface MedicineSearchResult {
  id: number;
  genericName: string;
  dosageForm: string;
  strength: string | null;
  presentation: string | null;
}
