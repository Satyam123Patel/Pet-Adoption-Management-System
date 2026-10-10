import { Navigate } from "react-router-dom";
import { useAdminAuthContext } from "../../hooks/useAdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuthContext();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in - redirect
  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  // Logged in - show content
  return children;
};

export default AdminProtectedRoute;