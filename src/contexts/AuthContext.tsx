import {
  login,
  logout,
  getStoredUser,
  type UserProfile,
} from '@/services/auth/authService';
import { useCallback, useMemo, useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/auth/auth'; 
interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserProfile['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const freshToken = await firebaseUser.getIdToken(true);
        localStorage.setItem('token', freshToken);
        setToken(freshToken);

        const storedUser = getStoredUser();
        setUser(storedUser);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      isLoading,
      signIn,
      signOut,
      hasRole,
    }),
    [user, token, isLoading, signIn, signOut, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;