import { useState } from 'react';
import { useAdminAuthContext } from '../../../hooks/useAdminAuthContext';

export const useAdminLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAdminAuthContext();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const adminLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || 'Invalid credentials');
        return false;
      }

      // Save admin to localStorage
      localStorage.setItem('admin', JSON.stringify(json));

      // Update auth context
      dispatch({ type: 'ADMIN_LOGIN', payload: json });

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      setError('Network error. Please try again.');
      console.error('Admin login error:', err);
      return false;
    }
  };

  return { adminLogin, isLoading, error };
};