import React from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAdminAuthContext } from "../../hooks/useAdminAuthContext";
import AdminFooter from "./AdminFooter";

const AdminPanel = () => {
  const { admin, dispatch } = useAdminAuthContext();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin');
      dispatch({ type: 'ADMIN_LOGOUT' });
      navigate('/admin', { replace: true });
    }
  };

  const menuItems = [
    { path: '/admin-panel', label: 'Dashboard', icon: 'bi-speedometer2', exact: true },
    { path: '/admin-panel/manage-pets', label: 'Manage Pets', icon: 'bi-plus-circle' },
    { path: '/admin-panel/pending-pets', label: 'Pending Pets', icon: 'bi-hourglass-split' },
    { path: '/admin-panel/adoption-requests', label: 'Adoption Requests', icon: 'bi-heart' },
    { path: '/admin-panel/approved', label: 'Approved Pets', icon: 'bi-check-circle' },
    { path: '/admin-panel/adopted-history', label: 'Adopted History', icon: 'bi-clock-history' },
    { path: '/admin-panel/tracking', label: 'Tracking', icon: 'bi-geo-alt' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold mb-0">
            <i className="bi bi-shield-check me-2"></i>
            Admin Panel
          </span>
          
          <div className="d-flex align-items-center text-white gap-3">
            <span className="me-3">
              <i className="bi bi-clock me-1"></i>
              {currentTime.toLocaleTimeString()}
            </span>
            
            <div className="dropdown">
              <button
                className="btn btn-outline-light btn-sm dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-1"></i>
                {admin?.name || 'Admin'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {/* ✅ ADD THIS: Go to Main Site Link in Dropdown */}
                <li>
                  <Link to="/" className="dropdown-item">
                    <i className="bi bi-house-door me-2"></i>
                    Go to Main Site
                  </Link>
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

      {/* Main Content Area with Sidebar */}
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          {/* LEFT SIDEBAR */}
          <div className="col-lg-2 col-md-3 bg-light border-end p-0">
            <div className="list-group list-group-flush">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `list-group-item list-group-item-action border-0 py-3 ${
                      isActive ? 'active bg-primary text-white' : ''
                    }`
                  }
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="col-lg-10 col-md-9 p-4">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
};

export default AdminPanel;