import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext'; // ✅ FIXED

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * ✅ Admin component to manage adoption requests
 * Expects data from JOIN query (user + pet details via FKs)
 */
const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { admin } = useAdminAuthContext(); // ✅ FIXED: Changed from user
  const token = admin?.token; // ✅ FIXED: Changed from user?.token

  const fetchRequests = useCallback(async () => {
    if (!token) {
      console.error('❌ No token found');
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Fetching pending adoption requests...');

      const response = await fetch(`${API_URL}/api/admin/adoptions/pending`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Received data:', data);

      setRequests(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      setRequests([]);
      alert('Failed to load adoption requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approve = async (id) => {
    if (!window.confirm('Approve this adoption request? This will mark the pet as adopted.')) {
      return;
    }

    try {
      console.log('✅ Approving request ID:', id);

      const response = await fetch(`${API_URL}/api/admin/adoptions/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      const result = await response.json();
      console.log('✅ Approval result:', result);

      alert('✅ Adoption approved successfully!');
      fetchRequests(); // Refresh list

    } catch (error) {
      console.error('❌ Approve failed:', error);
      alert('Failed to approve adoption: ' + error.message);
    }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this adoption request? The pet will be available again.')) {
      return;
    }

    try {
      console.log('❌ Rejecting request ID:', id);

      const response = await fetch(`${API_URL}/api/admin/adoptions/${id}/reject`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      const result = await response.json();
      console.log('✅ Rejection result:', result);

      alert('❌ Adoption request rejected');
      fetchRequests(); // Refresh list

    } catch (error) {
      console.error('❌ Reject failed:', error);
      alert('Failed to reject adoption: ' + error.message);
    }
  };

  const filtered = requests.filter(r =>
    r.pet_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading adoption requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          Pending Adoption Requests
          <span className="badge bg-warning ms-2">{requests.length}</span>
        </h4>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={fetchRequests}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by pet name, user name, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3 text-muted">
            {requests.length === 0 
              ? 'No pending adoption requests' 
              : 'No requests match your search'}
          </p>
        </div>
      ) : (
        <div className="row">
          {filtered.map(req => (
            <div className="col-12 mb-3" key={req.request_id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row">
                    {/* Pet Image */}
                    <div className="col-md-3">
                      <img
                        src={req.pet_image || 'https://placehold.co/250x250?text=Pet'}
                        alt={req.pet_name}
                        className="img-fluid rounded"
                        style={{ 
                          maxHeight: '200px', 
                          width: '100%',
                          objectFit: 'cover' 
                        }}
                        onError={(e) => { 
                          e.target.src = 'https://via.placeholder.com/250x250?text=No+Image'; 
                        }}
                      />
                    </div>

                    {/* Request Details */}
                    <div className="col-md-6">
                      {/* Pet Info */}
                      <h5 className="text-primary mb-2">
                        <i className="bi bi-heart-fill me-2"></i>
                        {req.pet_name}
                      </h5>
                      
                      <div className="mb-3">
                        <span className="badge bg-primary me-2">{req.pet_category}</span>
                        <span className="badge bg-secondary me-2">{req.pet_breed}</span>
                        <span className="badge bg-info">{req.pet_age} years</span>
                      </div>

                      <hr />

                      {/* Adopter Info */}
                      <h6 className="text-success mb-2">
                        <i className="bi bi-person-fill me-2"></i>
                        Adopter Information
                      </h6>
                      
                      <div className="mb-2">
                        <strong>Name:</strong> {req.user_name || 'N/A'}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {req.user_email || 'N/A'}
                      </div>
                      
                      <hr />

                      {/* Application Details */}
                      <h6 className="text-info mb-2">
                        <i className="bi bi-file-text me-2"></i>
                        Application Details
                      </h6>

                      <div className="mb-1">
                        <strong>Living Situation:</strong>{' '}
                        <span className="text-muted">
                          {req.living_situation || 'Not provided'}
                        </span>
                      </div>
                      
                      <div className="mb-1">
                        <strong>Previous Experience:</strong>{' '}
                        <span className="text-muted">
                          {req.previous_experience || 'Not provided'}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <strong>Family Composition:</strong>{' '}
                        <span className="text-muted">
                          {req.family_composition || 'Not provided'}
                        </span>
                      </div>

                      <p className="text-muted small mb-0">
                        <i className="bi bi-clock me-1"></i>
                        Submitted: {new Date(req.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-md-3 d-flex flex-column justify-content-center gap-2">
                      <button
                        className="btn btn-success btn-lg"
                        onClick={() => approve(req.request_id)}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-lg"
                        onClick={() => reject(req.request_id)}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionRequests;