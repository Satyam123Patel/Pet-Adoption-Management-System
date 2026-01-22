import React, { useState, useEffect, useCallback } from 'react';
import PetCard from './PetCard';
import { useAuthContext } from '../../hooks/useAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ApprovedRequests = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuthContext();
  const token = user?.token || localStorage.getItem('token');

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
    if (!window.confirm('Remove this pet permanently?')) return;

    try {
      await fetch(`${API_URL}/api/admin/pets/${petId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPets();
    } catch (error) {
      console.error('❌ Delete error:', error);
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
        Approved Pets
      </h4>

      <input
        className="form-control mb-3"
        placeholder="Search by name or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p>No approved pets</p>
        </div>
      ) : (
        <div className="row">
          {filtered.map(pet => (
            <div className="col-lg-6 mb-4" key={pet.id}>
              <PetCard
                pet={pet}
                updateCards={fetchPets}
                showDelete
                deleteBtnText="Remove Pet"
                onDelete={() => handleDelete(pet.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedRequests;