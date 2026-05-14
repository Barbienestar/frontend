export interface FullReportData {
  id: number;
  description: string;
  imageUrl: string;
  userFullName: string;
  medicineName: string;
  medicinePresentation: string | null;
  medicineDosageForm: string | null;
  hospitalName: string | null;
  createdAt: string;
}
