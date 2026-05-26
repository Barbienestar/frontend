import type { UserProfile } from 'firebase/auth';
import api from '../api';

interface CreateHealthUserPayload {
  name: string;
  last_name_1: string;
  last_name_2?: string;
  email: string;
  password: string;
  role_id: number;
  hospital_ids: number[];
}

interface CreateAdminPayload {
  name: string;
  last_name_1: string;
  last_name_2?: string;
  email: string;
  password: string;
  role_id: number;
}

export const createAdmin = async (
  req: CreateAdminPayload
): Promise<UserProfile> => {
  const profileResponse = await api.post<UserProfile>('/user', req);
  return profileResponse.data;
};

export const createHealthUser = async (
  req: CreateHealthUserPayload
): Promise<UserProfile> => {
  const profileResponse = await api.post<UserProfile>('/user', req);
  return profileResponse.data;
};
