import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext'; // ✅ FIXED

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ApprovedRequests = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { admin } = useAdminAuthContext(); // ✅ FIXED: Changed from user
  const token = admin?.token; // ✅ FIXED: Changed from user?.token

  const fetchPets = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/pets/approved`, {
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
    fetchPets();
  }, [fetchPets]);

  const handleDelete = async (petId) => {
    if (!window.confirm('Remove this pet from adoption list?')) return;

    try {
      await fetch(`${API_URL}/api/admin/pets/${petId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Pet removed');
      fetchPets();
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Failed to delete pet');
    }
  };

  const filtered = pets.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <i className="bi bi-check-circle me-2"></i>
        Available Pets for Adoption
        <span className="badge bg-success ms-2">{pets.length}</span>
      </h4>

      <input
        className="form-control mb-4"
        placeholder="Search by name or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3">No available pets</p>
        </div>
      ) : (
        <div className="row">
          {filtered.map(pet => (
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
                      <div className="mb-2">
                        <span className="badge bg-primary me-1">{pet.category}</span>
                        <span className="badge bg-secondary">{pet.breed}</span>
                      </div>
                      <p className="mb-1"><strong>Age:</strong> {pet.age} years</p>
                      <p className="mb-1"><strong>Gender:</strong> {pet.gender}</p>
                      <p className="mb-3"><strong>Status:</strong> {pet.status}</p>

                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleDelete(pet.id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove
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

export default ApprovedRequests;