import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/access',
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={'/forbidden'} replace />;
  }

  return <Outlet />;
};
