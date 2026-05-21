import api from '@/services/api';
import type { HospitalData } from '@/common/HospitalData';

export const getMyHospitals = async () => {
  const response = await api.get<HospitalData[]>('/hospitals/my-hospitals');
  return response.data;
};
