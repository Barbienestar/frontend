import type { UserProfile } from 'firebase/auth';
import api from './api';
import type { CreateUserRequest } from './auth/authService';

interface CreateHealthUserRequest extends CreateUserRequest {
  hospitalIds: number[];
}

export const createAdmin = async (
  req: CreateUserRequest
): Promise<UserProfile> => {
  const profileResponse = await api.post<UserProfile>('/user', req);
  return profileResponse.data;
};

export const createHealthUser = async (
  req: CreateHealthUserRequest
): Promise<UserProfile> => {
  const profileResponse = await api.post<UserProfile>('/user', req);
  return profileResponse.data;
};
