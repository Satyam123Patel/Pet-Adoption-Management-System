import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthContext } from "../../../hooks/useAdminAuthContext";

export const useAdminLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAdminAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await response.text();
      if (!text) throw new Error("Empty response from server");

      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.error || "Admin login failed");
      }

      // ✅ BACKEND ALREADY RETURNS EVERYTHING
      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role, // ADMIN
        token: data.token,
      };

      // ✅ STORE ADMIN SEPARATELY
      localStorage.setItem("admin", JSON.stringify(adminData));

      // ✅ UPDATE ADMIN CONTEXT
      dispatch({ type: "ADMIN_LOGIN", payload: adminData });

      // ✅ REDIRECT
      navigate("/admin-panel", { replace: true });

      return true;

    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
