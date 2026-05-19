import { createContext, useReducer, useEffect, useState } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch({
        type: "LOGIN",
        payload: JSON.parse(storedUser),
      });
    }

    // ✅ auth restored
    setIsAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};
