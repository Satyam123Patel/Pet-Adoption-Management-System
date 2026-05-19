import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext'; // ✅ FIXED

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AdoptedHistory = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { admin } = useAdminAuthContext(); // ✅ FIXED: Changed from user to admin
  const token = admin?.token; // ✅ FIXED: Get token from admin

  const fetchAdopted = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/pets/adopted`, {
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
    fetchAdopted();
  }, [fetchAdopted]);

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
        <i className="bi bi-clock-history me-2"></i>
        Adopted Pets History
        <span className="badge bg-info ms-2">{pets.length}</span>
      </h4>

      {pets.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3">No adopted pets</p>
        </div>
      ) : (
        <div className="row">
          {pets.map(pet => (
            <div className="col-lg-6 mb-4" key={pet.id}>
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-md-5">
                    <img
                      src={pet.image_url || 'https://placehold.co/250x250?text=Pet'}
                      className="img-fluid rounded-start h-100"
                      alt={pet.name}
                      style={{ objectFit: 'cover', minHeight: 200 }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/250x250?text=Pet+Image'; }}
                    />
                  </div>
                  <div className="col-md-7">
                    <div className="card-body">
                      <h5>{pet.name}</h5>
                      <span className="badge bg-success mb-2">Adopted</span>
                      <p className="mb-1"><strong>Category:</strong> {pet.category}</p>
                      <p className="mb-1"><strong>Breed:</strong> {pet.breed}</p>
                      <p className="mb-1"><strong>Age:</strong> {pet.age} years</p>
                      <p className="mb-0"><strong>Gender:</strong> {pet.gender}</p>
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

export default AdoptedHistory;