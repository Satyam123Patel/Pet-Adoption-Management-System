import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AdoptingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuthContext();
  const token = user?.token || localStorage.getItem('token');

  const fetchRequests = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/adoptions/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approve = async (id) => {
    if (!window.confirm('Approve this adoption request?')) return;

    try {
      await fetch(`${API_URL}/api/admin/adoptions/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
    } catch (error) {
      console.error('❌ Approve failed:', error);
    }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this adoption request?')) return;

    try {
      await fetch(`${API_URL}/api/admin/adoptions/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
    } catch (error) {
      console.error('❌ Reject failed:', error);
    }
  };

  const filtered = requests.filter(r =>
    r.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">
        <i className="bi bi-file-earmark-text me-2"></i>
        Pending Adoption Requests
      </h4>

      <input
        className="form-control mb-3"
        placeholder="Search by pet name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p>No pending requests</p>
        </div>
      ) : (
        filtered.map(req => (
          <div className="card mb-3" key={req.id}>
            <div className="card-body row">
              <div className="col-md-3">
                <img
                  src={req.petImage ? `${API_URL}/${req.petImage}` : '/placeholder-pet.jpg'}
                  alt={req.petName}
                  className="img-fluid rounded"
                  style={{ maxHeight: 150, objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/placeholder-pet.jpg'; }}
                />
              </div>
              <div className="col-md-6">
                <h5>{req.petName}</h5>
                <p><strong>Email:</strong> {req.email}</p>
                <p><strong>Phone:</strong> {req.phoneNo}</p>
                <p><strong>Living:</strong> {req.livingSituation}</p>
              </div>
              <div className="col-md-3 d-flex flex-column gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => approve(req.id)}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => reject(req.id)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdoptingRequests;