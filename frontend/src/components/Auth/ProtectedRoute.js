// src/components/ProtectedRoute/index.jsx - FIXED INFINITE LOOP

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
`;

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Only log once when component mounts, not on every render
  console.log("🛡️ ProtectedRoute Check:", {
    isAuthenticated,
    hasUser: !!user,
    loading,
    path: location.pathname,
  });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log("❌ ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ FIXED: Just render children, don't log repeatedly
  return children;
};

export default ProtectedRoute;
