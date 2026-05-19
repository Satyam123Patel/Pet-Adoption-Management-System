import React, { useState, useEffect } from 'react';
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext'; // ✅ FIXED

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TrackingManagement = () => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [trackingRecords, setTrackingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    note: '',
    vetVisitDate: '',
    vaccinated: false
  });

  const { admin } = useAdminAuthContext(); 
  const token = admin?.token; 

  useEffect(() => {
    fetchAdoptedPets();
  }, []);

  const fetchAdoptedPets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/tracking/adopted-pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAdoptedPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingRecords = async (petId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/tracking/pet/${petId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTrackingRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    fetchTrackingRecords(pet.id);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTracking = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/api/admin/tracking/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          petId: selectedPet.id,
          ...formData
        })
      });

      if (!response.ok) throw new Error('Failed to add tracking record');

      alert('✅ Tracking record added successfully!');
      setShowAddForm(false);
      setFormData({ location: '', note: '', vetVisitDate: '', vaccinated: false });
      fetchTrackingRecords(selectedPet.id);
      fetchAdoptedPets();
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Failed to add tracking record');
    }
  };

  const handleDeleteTracking = async (trackId) => {
    if (!window.confirm('Delete this tracking record?')) return;

    try {
      await fetch(`${API_URL}/api/admin/tracking/delete/${trackId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Tracking record deleted');
      fetchTrackingRecords(selectedPet.id);
      fetchAdoptedPets();
    } catch (error) {
      console.error('❌ Error:', error);
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
    <div className="row">
      {/* Left: List of Adopted Pets */}
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-geo-alt me-2"></i>
              Adopted Pets ({adoptedPets.length})
            </h5>
          </div>
          <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {adoptedPets.length === 0 ? (
              <p className="text-center text-muted p-3">No adopted pets yet</p>
            ) : (
              <div className="list-group list-group-flush">
                {adoptedPets.map(pet => (
                  <button
                    key={pet.id}
                    className={`list-group-item list-group-item-action ${
                      selectedPet?.id === pet.id ? 'active' : ''
                    }`}
                    onClick={() => handlePetSelect(pet)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={pet.image_url || '/placeholder-pet.jpg'}
                        alt={pet.name}
                        className="rounded me-3"
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/placeholder-pet.jpg'; }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{pet.name}</h6>
                        <small className="text-muted">
                          {pet.category} • {pet.breed}
                        </small>
                        <br />
                        <small className="badge bg-info">
                          {pet.tracking_count || 0} records
                        </small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Tracking Details */}
      <div className="col-md-8">
        {selectedPet ? (
          <>
            <div className="card shadow-sm mb-3">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-heart-fill text-danger me-2"></i>
                  Tracking: {selectedPet.name}
                </h5>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Record
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <img
                      src={selectedPet.image_url || '/placeholder-pet.jpg'}
                      alt={selectedPet.name}
                      className="img-fluid rounded"
                      onError={(e) => { e.target.src = '/placeholder-pet.jpg'; }}
                    />
                  </div>
                  <div className="col-md-9">
                    <p className="mb-1"><strong>Category:</strong> {selectedPet.category}</p>
                    <p className="mb-1"><strong>Breed:</strong> {selectedPet.breed}</p>
                    <p className="mb-1"><strong>Age:</strong> {selectedPet.age} years</p>
                    <p className="mb-1"><strong>Gender:</strong> {selectedPet.gender}</p>
                    <p className="mb-0">
                      <strong>Total Records:</strong>{' '}
                      <span className="badge bg-success">{selectedPet.tracking_count || 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Tracking Form */}
            {showAddForm && (
              <div className="card shadow-sm mb-3">
                <div className="card-header bg-success text-white">
                  <h6 className="mb-0">Add New Tracking Record</h6>
                </div>
                <div className="card-body">
                  <form onSubmit={handleAddTracking}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., Mumbai, Thane"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Vet Visit Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="vetVisitDate"
                          value={formData.vetVisitDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="General health check, vaccination, etc."
                        required
                      ></textarea>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="vaccinated"
                        checked={formData.vaccinated}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">Vaccinated</label>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Save Record
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Tracking Records Timeline */}
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h6 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Tracking History
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {trackingRecords.length === 0 ? (
                  <p className="text-center text-muted">No tracking records yet</p>
                ) : (
                  <div className="timeline">
                    {trackingRecords.map((record, index) => (
                      <div key={record.trackId} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="mb-2">
                                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                                {record.location}
                              </h6>
                              <p className="mb-2">{record.note}</p>
                              <div className="d-flex gap-2 flex-wrap">
                                {record.vaccinated && (
                                  <span className="badge bg-success">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Vaccinated
                                  </span>
                                )}
                                {record.vetVisitDate && (
                                  <span className="badge bg-info">
                                    <i className="bi bi-calendar-check me-1"></i>
                                    Vet: {new Date(record.vetVisitDate).toLocaleDateString()}
                                  </span>
                                )}
                                <span className="badge bg-secondary">
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(record.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteTracking(record.trackId)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <i className="bi bi-arrow-left-circle display-1 text-muted"></i>
              <h5 className="mt-3">Select a pet to view tracking details</h5>
              <p className="text-muted">Choose from the list on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingManagement;