export interface CriticalMedicine {
  id: number;
  genericName: string;
  stock: number;
}

export interface HospitalCriticalMedicinesResponse {
  hospitalId: number;
  hospitalName: string;
  criticalMedicines: CriticalMedicine[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
