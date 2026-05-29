import {
  login,
  loginWithGoogle,
  logout,
  getStoredUser,
  type UserProfile,
} from '@/services/auth/authService';
import api from '@/services/api';
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  createContext,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/auth/auth';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signInWithGoogle: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  hasRole: (role: UserProfile['role']) => boolean;
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const freshToken = await firebaseUser.getIdToken(true);
        localStorage.setItem('token', freshToken);
        setToken(freshToken);

        try {
          const response = await api.get<UserProfile>('/auth/me');
          localStorage.setItem('user', JSON.stringify(response.data));
          setUser(response.data);
        } catch {
          const storedUser = getStoredUser();
          if (storedUser) setUser(storedUser);
        }
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
    return loggedUser;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const loggedUser = await loginWithGoogle();
    setUser(loggedUser);
    setToken(localStorage.getItem('token'));
    return loggedUser;
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
      signInWithGoogle,
      signOut,
      hasRole,
      setUser,
    }),
    [
      user,
      token,
      isLoading,
      signIn,
      signInWithGoogle,
      signOut,
      hasRole,
      setUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
