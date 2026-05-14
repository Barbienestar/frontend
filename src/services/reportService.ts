import type { FullReportData } from '@/common/FullReportData';
import type { HospitalData } from '@/common/HospitalData';
import type { MedicineSearchResult } from '@/common/MedicineSearchResult';
import type { PaginatedResponse } from '@/common/PaginatedResponse';
import type { CreateReportData, ReportData } from '@/common/ReportData ';
import api from './api';

interface ReportImageData {
  imageUrl: string;
}

export const getMedicines = async (): Promise<MedicineSearchResult[]> => {
  const res = await api.get<MedicineSearchResult[]>('/medicines');
  return res.data;
};

export const getHospitals = async (): Promise<HospitalData[]> => {
  const res = await api.get<HospitalData[]>('/hospitals');
  return res.data;
};

export const createReport = async (
  data: CreateReportData
): Promise<ReportData> => {
  const res = await api.post<ReportData>('/reports', data);
  return res.data;
};

export const getMyReports = async (): Promise<ReportData[]> => {
  const res = await api.get<ReportData[]>('/reports/me');
  return res.data;
};

export const uploadImage = async (file: File): Promise<ReportImageData> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post<ReportImageData>('/image/upload', formData);
  return res.data;
};

export const getAdminPageReports = async (
  statusId: number,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<FullReportData>> => {
  const res = await api.get<PaginatedResponse<FullReportData>>(
    `/reports/status/${statusId}`,
    {
      params: {
        page,
        size: pageSize,
      },
    }
  );
  return res.data;
};
