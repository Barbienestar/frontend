import api from '@/services/api';
import type { HospitalData } from '@/common/HospitalData';
import type { HospitalCriticalMedicinesResponse } from '@/common/CriticalMedicineData';

export const getMyHospitals = async () => {
  const response = await api.get<HospitalData[]>('/hospitals/my-hospitals');
  return response.data;
};

export const getCriticalMedicines = async (
  hospitalId: number,
  page: number = 0
) => {
  const response = await api.get<HospitalCriticalMedicinesResponse>(
    `/hospitals/${hospitalId}/critical-medicines`,
    { params: { page, size: 10 } }
  );
  return response.data;
};
