import api from './api';
import type { MedicineData } from '@/common/MedicineData';
import type { HospitalData } from '@/common/HospitalData';
import type { CreateReportData, ReportData } from '@/common/ReportData ';

interface ReportImageData {
  imageUrl: string;
}

export const getMedicines = async (): Promise<MedicineData[]> => {
  const res = await api.get<MedicineData[]>('/medicines');
  return res.data;
};

export const getHospitals = async (): Promise<HospitalData[]> => {
  const res = await api.get<HospitalData[]>('/hospitals');
  return res.data;
};

export const createReport = async (
  data: CreateReportData
): Promise<ReportData> => {
  const res = await api.post<ReportData>('/reports/create', data);
  return res.data;
};

export const uploadImage = async (file: File): Promise<ReportImageData> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post<ReportImageData>('/image/upload', formData);
  return res.data;
};
