import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './auth'

export const login = async (email: string, password: string): Promise<void> => {
  const UserCredential = await signInWithEmailAndPassword(auth, email, password)
  const token = await UserCredential.user.getIdToken()
  localStorage.setItem('token', token)
}

export const logout = async (): Promise<void> => {
  await signOut(auth)
  localStorage.removeItem('token')
}
