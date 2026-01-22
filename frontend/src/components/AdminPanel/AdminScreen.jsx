import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ApprovedRequests from './ApprovedRequests';
import AdoptingRequests from './AdoptingRequests';
import AdoptedHistory from './AdoptedHistory';
import PendingPetsAdmin from './PendingPetsAdmin';

const AdminScreen = () => {
  const [screen, setScreen] = useState('dashboard');

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', color: 'primary' },
    { key: 'pendingPets', label: 'Pending Pets', icon: 'bi-hourglass-split', color: 'warning' },
    { key: 'approvedPets', label: 'Approved Pets', icon: 'bi-check-circle', color: 'success' },
    { key: 'adoptionRequests', label: 'Adoption Requests', icon: 'bi-heart', color: 'danger' },
    { key: 'adoptedHistory', label: 'Adopted History', icon: 'bi-clock-history', color: 'info' }
  ];

  return (
    <div className="row g-3">
      <div className="col-lg-3 col-xl-2">
        <div className="card shadow-sm h-100">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <i className="bi bi-menu-button-wide me-2"></i>
              Menu
            </h5>
          </div>
          <div className="list-group list-group-flush">
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`list-group-item list-group-item-action ${
                  screen === item.key ? 'active' : ''
                }`}
                onClick={() => setScreen(item.key)}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="col-lg-9 col-xl-10">
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h4 className="mb-0">
              <i className={`bi ${menuItems.find(i => i.key === screen)?.icon} me-2`}></i>
              {menuItems.find(i => i.key === screen)?.label}
            </h4>
          </div>
          <div className="card-body p-4">
            {screen === 'dashboard' && <Dashboard />}
            {screen === 'pendingPets' && <PendingPetsAdmin />}
            {screen === 'approvedPets' && <ApprovedRequests />}
            {screen === 'adoptionRequests' && <AdoptingRequests />}
            {screen === 'adoptedHistory' && <AdoptedHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;