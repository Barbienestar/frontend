export interface MedicineSearchResult {
  id: number;
  generic_name: string;
  dosage_form: string;
  strength: string | null;
  presentation: string | null;
}