//1
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [signupError, setSignupError] = useState(null);
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password, otp) => {
    setSignupIsLoading(true);
    setSignupError(null);

    try {
      // Signup WITH OTP (backend verifies OTP)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Signup failed");
      }

      // CREATE A SINGLE USER OBJECT (MATCHES useLogin.js)
      const userWithToken = {
        ...data.user,
        token: data.token,
      };

      // STORE EVERYTHING TOGETHER
      localStorage.setItem("user", JSON.stringify(userWithToken));
      localStorage.setItem("token", data.token);

      // UPDATE AUTH CONTEXT (MATCHES AuthContext.jsx)
      dispatch({
        type: "LOGIN",
        payload: userWithToken,
      });

      setSignupIsLoading(false);
      return { success: true };

    } catch (error) {
      setSignupError(error.message);
      setSignupIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  return { signup, signupIsLoading, signupError, setSignupError };
};
