import {
  login,
  logout,
  getStoredUser,
  type UserProfile,
} from '@/services/auth/authService';
import { useCallback, useMemo, useState, createContext } from 'react';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserProfile['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const signIn = useCallback(async (email: string, password: string) => {
    const loggedUser = await login(email, password);
    setUser(loggedUser);
    setToken(localStorage.getItem('token'));
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
    setToken(null);
  }, []);

  const hasRole = useCallback(
    (role: UserProfile['role']) => !!user && user.role === role,
    [user]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      signIn,
      signOut,
      hasRole,
    }),
    [user, token, signIn, signOut, hasRole]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
