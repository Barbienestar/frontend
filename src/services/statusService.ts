import type {
  StatusCountResponse,
  StatusResponse,
} from '@/common/StatusResponse';
import api from './api';

export const listStatuses = async () => {
  const res = await api.get<StatusResponse[]>('/status');
  return res.data;
};

export const getReportsCountByStatus = async (
  statusId: number
): Promise<StatusCountResponse> => {
  const res = await api.get<StatusCountResponse>(
    `/reports/status/${statusId}/count`
  );
  return res.data;
};
