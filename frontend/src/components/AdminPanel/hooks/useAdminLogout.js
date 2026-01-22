import { useAuthContext } from "../../../hooks/useAuthContext";

export const useAdminLogout = () => {
    const { dispatch } = useAuthContext();
    
    const adminLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('user'); // Also clear regular user data
        dispatch({ type: 'LOGOUT' });
    };
    
    return { adminLogout };
};