import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';

import { AuthContextProvider } from './Context/AuthContext.jsx';
import { AdminAuthProvider } from "./Context/AdminAuthContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👤 USER AUTH CONTEXT */}
    <AuthContextProvider>
      {/* 🛡️ ADMIN AUTH CONTEXT */}
      <AdminAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthContextProvider>
  </StrictMode>
);
