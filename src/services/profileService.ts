import api from './api';
import type { UserProfile, UpdateUserDto } from './auth/authService';

export const updateProfile = async (
  data: UpdateUserDto
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>('/user', data);
  return response.data;
};
