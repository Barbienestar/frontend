import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './auth'
import api from '../api'

export interface UserProfile {
  id: string
  name: string
  lastName: string
  role: string
  email: string
}

export const login = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  const UserCredential = await signInWithEmailAndPassword(auth, email, password)
  const token = await UserCredential.user.getIdToken()
  localStorage.setItem('token', token)

  const profileResponse = await api.get<UserProfile>('/auth/me')
  localStorage.setItem('user', JSON.stringify(profileResponse.data))
  return profileResponse.data
}

export const logout = async (): Promise<void> => {
  await signOut(auth)
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getStoredUser = (): UserProfile | null => {
  const user = localStorage.getItem('user')
  if (!user) return null
  try {
    JSON.parse(user) as UserProfile
  } catch {
    return null
  }
}
