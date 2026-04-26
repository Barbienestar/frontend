export interface CreateReportData {
  medicineId: number;
  hospitalId: number;
  description: string;
}

export interface ReportData {
  id: number;
  medicineName: string;
  hospitalName: string;
  status: string;
  description: string;
  createdAt: string;
}