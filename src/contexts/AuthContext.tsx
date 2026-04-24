import {
  login,
  logout,
  getStoredUser,
  type UserProfile,
} from '@/services/auth/authService'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  hasRole: (role: UserProfile['role']) => boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    setToken(localStorage.getItem('token'))
    setIsLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const loggedUser = await login(email, password)
    setUser(loggedUser)
    setToken(localStorage.getItem('token'))
  }, [])

  const signOut = useCallback(async () => {
    await logout()
    setUser(null)
    setToken(null)
  }, [])

  const hasRole = useCallback(
    (role: UserProfile['role']) => !!user && user.role === role,
    [user]
  )

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      signIn,
      signOut,
      hasRole,
    }),
    [user, token, isLoading, signIn, signOut, hasRole]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
