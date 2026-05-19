//1
import { useAdminAuthContext } from "../../../hooks/useAdminAuthContext";

export const useAdminLogout = () => {
    const { dispatch } = useAdminAuthContext();
    
    const adminLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('user'); // Also clear regular user data
        dispatch({ type: 'LOGOUT' });
    };
    
    return { adminLogout };
};