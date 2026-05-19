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

import ManagePets from "./components/AdminPanel/ManagePets";
import AdminLogin from "./components/AdminPanel/AdminLogin";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Dashboard from "./components/AdminPanel/Dashboard";
import TrackingManagement from "./components/AdminPanel/TrackingManagement";
import AdoptingRequests from "./components/AdminPanel/AdoptionRequests";
import ApprovedRequests from "./components/AdminPanel/ApprovedRequests";
import AdoptedHistory from "./components/AdminPanel/AdoptedHistory";
import PendingPetsAdmin from "./components/AdminPanel/PendingPetsAdmin";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminPanel/AdminProtectedRoute";

const App = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      {/* USER AUTH */}
      <Route
        path="/auth"
        element={!user ? <Auth /> : <Navigate to="/" replace />}
      />

      {/* ADMIN LOGIN */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* ADMIN PANEL */}
      <Route
        path="/admin-panel"
        element={
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="manage-pets" element={<ManagePets />} />
        <Route path="tracking" element={<TrackingManagement />} />
        <Route path="adoption-requests" element={<AdoptingRequests />} />
        <Route path="approved" element={<ApprovedRequests />} />
        <Route path="adopted-history" element={<AdoptedHistory />} />
        <Route path="pending-pets" element={<PendingPetsAdmin />} />
      </Route>

      {/* USER PAGES */}
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
