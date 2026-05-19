import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthReady } = useAuthContext();

  // ⏳ WAIT until auth is restored
  if (!isAuthReady) return null;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
