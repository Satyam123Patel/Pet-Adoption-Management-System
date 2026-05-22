import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminLogin } from "./hooks/useAdminLogin";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { adminLogin, error, isLoading } = useAdminLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await adminLogin(email, password);
    if (success) {
      navigate("/admin-panel", { replace: true });
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(to right, #f8fafc, #eef2ff)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-10">
            <div
              className="card shadow-lg border-0 rounded-4 overflow-hidden"
              style={{ minHeight: "600px" }}
            >
              <div className="row g-0 h-100">

                {/* LEFT PANEL */}
                <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-between p-5">
                  <div className="text-center">
                    <i className="bi bi-shield-lock-fill display-1 mb-3"></i>
                    <h2 className="fw-bold mb-2">Admin Portal</h2>
                    <p className="opacity-75 fs-5">
                      Pet Adoption Management System
                    </p>
                  </div>

                  <div className="text-center">
                    <i className="bi bi-heart-pulse display-4 mb-3"></i>
                    <p className="opacity-75">
                      Secure admin access for managing pets, requests,
                      and adoption analytics.
                    </p>
                  </div>

                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <span>Manage Adoption Requests</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <span>Track Pet Applications</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <span>Monitor System Analytics</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-md-7 bg-white p-5 d-flex flex-column justify-content-center">
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted mb-4 fs-5">
                    Please enter your credentials
                  </p>

                  {error && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* EMAIL */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4 position-relative">
                      <label className="form-label fw-semibold">
                        Password
                      </label>

                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg pe-5"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />

                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 mt-3 me-2 border-0 bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          } text-muted`}
                        ></i>
                      </button>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 fw-semibold py-3 shadow-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In to Dashboard
                        </>
                      )}
                    </button>
                  </form>

                  {/* BACK LINK */}
                  <div className="text-center pt-3 border-top mt-4">
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to User Login
                    </Link>
                  </div>

                  {/* NOTICE */}
                  <div className="alert alert-light border mt-4 mb-0">
                    <small className="text-muted d-flex align-items-start">
                      <i className="bi bi-info-circle me-2 mt-1"></i>
                      This area is restricted to authorized administrators only.
                      All access attempts are logged.
                    </small>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;