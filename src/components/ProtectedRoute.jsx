import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole, redirectTo }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn || userRole !== allowedRole) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return <Outlet />;
}