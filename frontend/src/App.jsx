import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import Services from "./components/Services/Services";
import Pets from "./components/Pets/Pets";
import Contact from "./components/Contact/Contact";
import Auth from "./components/Auth/Auth";
import Profile from "./components/Profile/Profile";
import FourOhFourPage from "./components/FourZeroFour/FourOFour";

import AdminLogin from "./components/AdminPanel/AdminLogin";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      {/* USER LOGIN */}
      <Route
        path="/auth"
        element={!user ? <Auth /> : <Navigate to="/" replace />}
      />

      {/* ADMIN LOGIN - Always accessible */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* ADMIN PANEL - Protected */}
      <Route
        path="/admin-panel/*"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* USER ROUTES - Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Layout>
              <Services />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pets"
        element={
          <ProtectedRoute>
            <Layout>
              <Pets />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Layout>
              <Contact />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<FourOhFourPage />} />
    </Routes>
  );
};

export default App;