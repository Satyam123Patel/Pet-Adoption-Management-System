import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  name: '',
  category: '',
  breed: '',
  age: '',
  gender: 'M',
  status: 'available',
  shelterId: ''
};

const ManagePets = () => {
  const { admin } = useAdminAuthContext();
  const token = admin?.token;

  const [pets, setPets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  // ========== FETCH PETS ==========
  const fetchPets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/pets`, { headers });
      const data = await res.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Failed to fetch pets:', err);
    } finally {
      loading(false);
    }
  }, [token]);

  // ========== FETCH SHELTERS ==========
  const fetchShelters = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/shelters`, { headers });
      const data = await res.json();
      setShelters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Failed to fetch shelters:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchPets();
    fetchShelters();
  }, [fetchPets, fetchShelters]);

  // ========== HANDLE FORM CHANGE ==========
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ========== OPEN ADD FORM ==========
  const openAddForm = () => {
    setEditingPet(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowForm(true);
  };

  // ========== OPEN EDIT FORM ==========
  const openEditForm = (pet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name || '',
      category: pet.category || '',
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender || 'M',
      status: pet.status || 'available',
      shelterId: pet.shelterId || ''
    });
    setImageFile(null);
    setShowForm(true);
  };

  // ========== SUBMIT FORM (ADD or EDIT) ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('breed', form.breed);
      formData.append('age', form.age); // Passed nicely as stringified decimal
      formData.append('gender', form.gender);
      formData.append('status', form.status);
      if (form.shelterId) formData.append('shelterId', form.shelterId);
      if (imageFile) formData.append('image', imageFile);

      const url = editingPet
        ? `${API_URL}/api/admin/pets/${editingPet.id}`
        : `${API_URL}/api/admin/pets/add`;

      const method = editingPet ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert(editingPet ? '✅ Pet updated!' : '✅ Pet added!');
      setShowForm(false);
      fetchPets();
    } catch (err) {
      console.error('❌ Submit failed:', err);
      alert('Failed to save pet. Check console.');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== DELETE PET ==========
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/pets/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert('🗑️ Pet deleted!');
      fetchPets();
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert('Failed to delete pet.');
    }
  };

  // ========== FILTER PETS ==========
  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase().includes(search.toLowerCase()) ||
    pet.category?.toLowerCase().includes(search.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(search.toLowerCase())
  );

  // ========== CATEGORY COUNTS ==========
  const categoryCounts = pets.reduce((acc, pet) => {
    const cat = pet.category?.toLowerCase();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryEmoji = {
    dog: '🐶',
    cat: '🐱',
    bird: '🐦',
    fish: '🐟',
    rabbit: '🐰',
    other: '🐾'
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading pets...</p>
      </div>
    );
  }

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Manage Pets
          <span className="badge bg-primary ms-2">{pets.length}</span>
        </h4>
        <button className="btn btn-primary" onClick={openAddForm}>
          <i className="bi bi-plus-lg me-1"></i>
          Add New Pet
        </button>
      </div>

      {/* ===== CATEGORY COUNT BADGES ===== */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <span
            key={category}
            className="badge rounded-pill bg-light text-dark border"
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            {categoryEmoji[category] || '🐾'} {category} — {count}
          </span>
        ))}
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by name, category, breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== ADD / EDIT FORM ===== */}
      {showForm && (
        <div className="card shadow-sm mb-4 border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between">
            <h5 className="mb-0">
              {editingPet ? `✏️ Edit Pet — ${editingPet.name}` : '➕ Add New Pet'}
            </h5>
            <button className="btn-close btn-close-white" onClick={() => setShowForm(false)} />
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Pet Name *</label>
                  <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bruno"
                  />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="fish">Fish</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Breed */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Breed</label>
                  <input
                    name="breed"
                    className="form-control"
                    value={form.breed}
                    onChange={handleChange}
                    placeholder="e.g. Labrador"
                  />
                </div>

                {/* Age */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Age (years) *</label>
                  <input
                    name="age"
                    type="number"
                    min="0"
                    max="30"
                    step="any" 
                    className="form-control"
                    value={form.age}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 1.5"
                  />
                </div>

                {/* Gender */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Gender *</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="U">Unknown</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Status *</label>
                  <select
                    name="status"
                    className="form-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                </div>

                {/* Shelter */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Shelter</label>
                  <select
                    name="shelterId"
                    className="form-select"
                    value={form.shelterId}
                    onChange={handleChange}
                  >
                    <option value="">Select shelter</option>
                    {shelters.map(s => (
                      <option key={s.shelterId} value={s.shelterId}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">
                    Pet Image {editingPet ? '(leave empty to keep existing)' : '*'}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required={!editingPet}
                  />
                </div>

                {/* Buttons */}
                <div className="col-12 d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting
                      ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                      : editingPet ? '💾 Update Pet' : '➕ Add Pet'
                    }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== PETS TABLE ===== */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3 text-muted">No pets found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.map(pet => (
                <tr key={pet.id}>
                  <td>
                    <img
                      src={pet.image_url || 'https://placehold.co/60x60?text=Pet'}
                      alt={pet.name}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=🐾'; }}
                    />
                  </td>
                  <td className="fw-semibold">{pet.name}</td>
                  <td>
                    <span className="badge bg-primary">{pet.category}</span>
                  </td>
                  <td>{pet.breed || '—'}</td>
                  <td>{pet.age} yrs</td>
                  <td>
                    {pet.gender === 'M' ? '♂ Male' : pet.gender === 'F' ? '♀ Female' : 'Unknown'}
                  </td>
                  <td>
                    <span className={`badge ${
                      pet.status === 'available' ? 'bg-success' :
                      pet.status === 'pending'   ? 'bg-warning text-dark' :
                      'bg-secondary'
                    }`}>
                      {pet.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditForm(pet)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(pet.id, pet.name)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePets;