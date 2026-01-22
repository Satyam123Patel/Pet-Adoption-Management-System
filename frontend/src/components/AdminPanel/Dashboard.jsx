import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    pets: 0,
    requests: 0,
    adopted: 0
  });
  const [petTypes, setPetTypes] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (!token) {
      console.error('❌ No admin token found');
      setLoading(false);
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const fetchDashboardData = async () => {
      try {
        const [users, pets, requests, adopted, types, monthly] = await Promise.all([
          fetch(`${API}/api/admin/stats/users`, { headers }).then(r => r.json()),
          fetch(`${API}/api/admin/stats/pets`, { headers }).then(r => r.json()),
          fetch(`${API}/api/admin/stats/requests`, { headers }).then(r => r.json()),
          fetch(`${API}/api/admin/stats/adopted`, { headers }).then(r => r.json()),
          fetch(`${API}/api/admin/stats/pet-types`, { headers }).then(r => r.json()),
          fetch(`${API}/api/admin/stats/monthly`, { headers }).then(r => r.json())
        ]);

        setStats({
          users: users.count || 0,
          pets: pets.count || 0,
          requests: requests.count || 0,
          adopted: adopted.count || 0
        });

        setPetTypes(
          types.map(item => ({
            name: item._id,
            value: item.count,
            color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][Math.floor(Math.random() * 4)]
          }))
        );

        setMonthlyData(monthly);
      } catch (err) {
        console.error('❌ Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, API]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">
        <i className="bi bi-speedometer2 me-2"></i>
        Dashboard Overview
      </h4>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <StatCard title="Users" value={stats.users} color="primary" icon="people" />
        <StatCard title="Pets" value={stats.pets} color="success" icon="heart" />
        <StatCard title="Requests" value={stats.requests} color="warning" icon="envelope" />
        <StatCard title="Adopted" value={stats.adopted} color="info" icon="check-circle" />
      </div>

      {/* Charts */}
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Pet Type Distribution</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              {petTypes.length > 0 && (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={petTypes} dataKey="value" label>
                      {petTypes.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Monthly Activity</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              {monthlyData.length > 0 && (
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="adoptions" fill="#00C49F" />
                    <Bar dataKey="requests" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className="col-md-3">
    <div className={`card bg-${color} text-white shadow`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-2">{title}</h6>
          <h2 className="mb-0">{value}</h2>
        </div>
        <i className={`bi bi-${icon} display-5 opacity-50`}></i>
      </div>
    </div>
  </div>
);

export default Dashboard;