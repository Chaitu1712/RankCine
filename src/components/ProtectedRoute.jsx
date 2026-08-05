import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole }) {
  const currentUserRole = 'SUPER_ADMIN'; 

  if (currentUserRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}