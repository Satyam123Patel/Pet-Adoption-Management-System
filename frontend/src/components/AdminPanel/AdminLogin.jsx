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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              <div className="row g-0">

                {/* LEFT PANEL */}
                <div className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center p-4">
                  <div className="text-center mb-4">
                    <i className="bi bi-shield-lock-fill display-3 mb-3"></i>
                    <h3 className="fw-bold mb-2">Admin Portal</h3>
                    <p className="opacity-75 mb-0">
                      Pet Adoption Management System
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <span>Manage Adoption Requests</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
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
                <div className="col-md-7 bg-white p-4 p-md-5">
                  <h4 className="fw-bold mb-2">Welcome Back</h4>
                  <p className="text-muted mb-4">
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

                      {/* 👁 Eye Button */}
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        } position-absolute top-50 end-0 translate-middle-y me-3 text-muted`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword((prev) => !prev)}
                      ></i>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 fw-semibold"
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
                    <Link to="/login" className="text-decoration-none">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to User Login
                    </Link>
                  </div>

                  {/* NOTICE */}
                  <div className="alert alert-light border mt-3 mb-0">
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
