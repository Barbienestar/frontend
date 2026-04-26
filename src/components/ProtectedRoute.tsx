import { useAuth } from '@/contexts/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/access',
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={'/forbidden'} replace />;
  }

  return <Outlet />;
};
