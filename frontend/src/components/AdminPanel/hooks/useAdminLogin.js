import { useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';

export const useAdminLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      const response = await fetch(`${API}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Admin login failed');
      }

      // ✅ Store both user object AND token separately
      localStorage.setItem('user', JSON.stringify(json.user));
      localStorage.setItem('token', json.token);

      dispatch({ type: 'LOGIN', payload: json.user });

      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return false;
    }
  };

  return { login, isLoading, error };
};