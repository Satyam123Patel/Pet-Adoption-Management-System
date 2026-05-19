import { Navigate } from "react-router-dom";
import { useAdminAuthContext } from "../../hooks/useAdminAuthContext";
import { useEffect, useState } from "react";

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give context time to load from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Still checking - show nothing
  if (isChecking) {
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