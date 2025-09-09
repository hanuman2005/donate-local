import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // adjust path if needed

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or your LoadingSpinner component
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
