//1
import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PendingPetsAdmin = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { admin } = useAdminAuthContext();
  const token = admin?.token; // ✅ FIXED: Changed from user?.token

  const fetchPending = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/pets/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const approve = async (id) => {
    if (!window.confirm('Approve this pet for adoption?')) return;

    try {
      await fetch(`${API_URL}/api/admin/pets/approve/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Pet approved!');
      fetchPending();
    } catch (error) {
      console.error('❌ Approve failed:', error);
      alert('Failed to approve pet');
    }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this pet?')) return;

    try {
      await fetch(`${API_URL}/api/admin/pets/reject/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('❌ Pet rejected');
      fetchPending();
    } catch (error) {
      console.error('❌ Reject failed:', error);
      alert('Failed to reject pet');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">
        <i className="bi bi-hourglass-split me-2"></i>
        Pending Posted Pets
        <span className="badge bg-warning ms-2">{pets.length}</span>
      </h4>
      <p className="text-muted">Pets that users want to give up for adoption</p>

      {pets.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3">No pending pets</p>
        </div>
      ) : (
        <div className="row">
          {pets.map(pet => (
            <div className="col-lg-6 mb-4" key={pet.id}>
              <div className="card shadow-sm">
                <img
                  src={pet.imagePath}
                  className="card-img-top"
                  alt={pet.name}
                  style={{ height: 250, objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/250x250?text=Pet+Image'; }}
                />
                <div className="card-body">
                  <h5 className="card-title">{pet.name}</h5>
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">{pet.category}</span>
                    <span className="badge bg-secondary">{pet.breed || 'Mixed'}</span>
                  </div>
                  <p className="mb-1"><strong>Age:</strong> {pet.age} years</p>
                  <p className="mb-1"><strong>Gender:</strong> {pet.gender || 'Unknown'}</p>
                  <p className="mb-1"><strong>Location:</strong> {pet.location}</p>
                  <p className="mb-1"><strong>Owner:</strong> {pet.email}</p>
                  <p className="mb-2"><strong>Phone:</strong> {pet.phone}</p>
                  {pet.description && (
                    <p className="text-muted small mb-3">{pet.description}</p>
                  )}

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success w-100"
                      onClick={() => approve(pet.id)}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Approve
                    </button>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => reject(pet.id)}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Reject
                    </button>
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

export default PendingPetsAdmin;