import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PendingPetsAdmin = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthContext();
  const token = user?.token || localStorage.getItem('token');

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
    if (!window.confirm('Approve this pet?')) return;

    try {
      await fetch(`${API_URL}/api/admin/pets/approve/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPending();
    } catch (error) {
      console.error('❌ Approve failed:', error);
    }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this pet?')) return;

    try {
      await fetch(`${API_URL}/api/admin/pets/reject/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPending();
    } catch (error) {
      console.error('❌ Reject failed:', error);
    }
  };

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
        <i className="bi bi-hourglass-split me-2"></i>
        Pending Pet Approvals
      </h4>

      {pets.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p>No pending pets</p>
        </div>
      ) : (
        <div className="row">
          {pets.map(pet => (
            <div className="col-lg-6 mb-4" key={pet.id}>
              <div className="card shadow-sm">
                <img
                  src={`${API_URL}/images/${pet.imagePath}`}
                  className="card-img-top"
                  alt={pet.name}
                  style={{ height: 220, objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5>{pet.name}</h5>
                  <p><strong>Category:</strong> {pet.category}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>

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