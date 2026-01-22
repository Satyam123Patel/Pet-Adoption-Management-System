import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/useAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PetCard = ({
  pet,
  updateCards,
  deleteBtnText = 'Delete',
  showDelete = false,
  adoptedView = false,
  onDelete
}) => {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuthContext();
  const token = user?.token || localStorage.getItem('token');

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleDelete = async () => {
    if (!token) return alert('Admin session expired');
    if (!window.confirm(`Are you sure you want to ${deleteBtnText.toLowerCase()}?`)) return;

    setIsDeleting(true);

    try {
      if (onDelete) {
        await onDelete(pet.id);
      } else {
        const endpoint = adoptedView
          ? `${API_URL}/api/admin/pets/adopted/${pet.id}`
          : `${API_URL}/api/admin/pets/${pet.id}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      }

      setShowSuccess(true);
      if (updateCards) updateCards();
    } catch (error) {
      console.error('❌ Delete failed:', error);
      setShowError(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {showError && (
        <div className="alert alert-danger alert-dismissible fade show">
          Failed to delete. Please try again.
          <button className="btn-close" onClick={() => setShowError(false)}></button>
        </div>
      )}

      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show">
          Successfully deleted!
          <button className="btn-close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}

      <div className="card h-100 shadow-sm">
        <div className="row g-0 h-100">
          <div className="col-md-5">
            <img
              src={
                pet.image_url
                  ? `${API_URL}/images/${pet.image_url}`
                  : '/placeholder-pet.jpg'
              }
              className="img-fluid rounded-start h-100 w-100"
              alt={pet.name}
              style={{ objectFit: 'cover', minHeight: 200 }}
              onError={(e) => { e.target.src = '/placeholder-pet.jpg'; }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body h-100 d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-tag me-2"></i>
                {pet.name || 'Unnamed Pet'}
              </h5>

              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-info">
                  {pet.age ?? 'N/A'} years
                </span>
                <span className="badge bg-secondary">
                  {pet.category || 'Unknown'}
                </span>
              </div>

              <p className="mb-1"><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
              <p className="mb-1"><strong>Gender:</strong> {pet.gender || 'N/A'}</p>

              {adoptedView && pet.adoptedAt && (
                <p className="text-success mt-2">
                  <i className="bi bi-calendar-check me-1"></i>
                  Adopted {formatTimeAgo(pet.adoptedAt)}
                </p>
              )}

              <div className="mt-auto pt-3">
                {showDelete && (
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-2"></i>
                        {deleteBtnText}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetCard;
