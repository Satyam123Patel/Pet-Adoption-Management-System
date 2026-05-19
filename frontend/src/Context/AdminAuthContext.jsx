import { createContext, useReducer, useEffect, useState } from "react";

export const AdminAuthContext = createContext();

const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case "ADMIN_LOGIN":
      return { admin: action.payload };
    case "ADMIN_LOGOUT":
      return { admin: null };
    default:
      return state;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, {
    admin: null,
  });
  
  const [loading, setLoading] = useState(true);

  // Restore admin session on page refresh
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        dispatch({
          type: "ADMIN_LOGIN",
          payload: adminData,
        });
      } catch (error) {
        console.error("Failed to parse stored admin data:", error);
        localStorage.removeItem("admin");
      }
    }
    
    setLoading(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, dispatch, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};