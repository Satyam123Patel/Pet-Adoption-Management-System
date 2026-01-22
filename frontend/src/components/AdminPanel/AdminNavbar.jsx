import React, { useState, useEffect } from 'react';
import { useAdminLogout } from './hooks/useAdminLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { adminLogout } = useAdminLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to logout?')) {
      await adminLogout();
      navigate('/admin');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand d-flex align-items-center">
          <i className="bi bi-shield-check fs-3 me-2"></i>
          <div>
            <span className="fw-bold">Admin Panel</span>
            <small className="d-block text-white-50" style={{ fontSize: '0.75rem' }}>
              Pet Adoption Management System
            </small>
          </div>
        </span>
        
        <div className="d-flex align-items-center">
          <div className="me-3 d-none d-md-block">
            <span className="text-white">
              <i className="bi bi-clock me-1"></i>
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short',
                year: 'numeric' 
              })} | {currentTime.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person-circle fs-5 me-2"></i>
              <span className="me-2">{user?.username || 'Admin'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={() => navigate('/')}>
                  <i className="bi bi-house me-2"></i>
                  Go to Main Site
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;