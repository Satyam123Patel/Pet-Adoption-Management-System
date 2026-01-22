import React from 'react';
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import AdminScreen from './AdminScreen';

const AdminPanel = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AdminNavbar/>
      <main className="flex-grow-1 py-3">
        <div className="container-fluid px-4">
          <AdminScreen/>
        </div>
      </main>
      <AdminFooter/>
    </div>
  );
};

export default AdminPanel;