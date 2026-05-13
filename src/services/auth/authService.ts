import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './auth';
import api from '../api';

export interface CreateUserRequest {
  name: string;
  last_name_1: string;
  last_name_2?: string;
  email: string;
  password: string;
  age?: number;
  suburbId: number;
  roleId: number;
}

export interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  role: string;
  email: string;
}

export const signup = async (req: CreateUserRequest): Promise<UserProfile> => {
  const profileResponse = await api.post<UserProfile>('/user', req);
  const UserCredential = await signInWithEmailAndPassword(
    auth,
    req.email,
    req.password
  );
  const token = await UserCredential.user.getIdToken();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(profileResponse.data));

  return profileResponse.data;
};

export const login = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  const UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await UserCredential.user.getIdToken();
  localStorage.setItem('token', token);

  const profileResponse = await api.get<UserProfile>('/auth/me');
  localStorage.setItem('user', JSON.stringify(profileResponse.data));
  return profileResponse.data;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = (): UserProfile | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user) as UserProfile;
  } catch {
    return null;
  }
};
