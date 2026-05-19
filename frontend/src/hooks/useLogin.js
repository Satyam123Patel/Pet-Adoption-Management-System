import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Invalid email or password");
      }

      // ✅ CREATE A SINGLE USER OBJECT (IMPORTANT)
      const userWithToken = {
        ...data.user,
        token: data.token,
      };

      // ✅ STORE EVERYTHING TOGETHER
      localStorage.setItem("user", JSON.stringify(userWithToken));

      // ✅ UPDATE AUTH CONTEXT (MATCHES AuthContext.jsx)
      dispatch({
        type: "LOGIN",
        payload: userWithToken,
      });

      setIsLoading(false);
      return { success: true };

    } catch (error) {
      setLoginError(error.message);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  return { login, isLoading, loginError, setLoginError };
};
