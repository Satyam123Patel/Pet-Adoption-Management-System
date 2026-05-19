//1
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const AdoptionFormCard = ({ application, onApprove, onReject, pet }) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this application?')) return;

    setLoading(true);
    setAction('approving');
    await onApprove(application.id);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;

    setLoading(true);
    setAction('rejecting');
    await onReject(application.id);
    setLoading(false);
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'approved':
        return <span className="badge bg-success">Approved</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="card border shadow-sm h-100">

      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-person-circle me-2"></i>
          {application.fullName}
        </h6>

        {getStatusBadge(application.status)}
      </div>

      <div className="card-body">

        <div className="row g-2 mb-3">
          <div className="col-6">
            <small className="text-muted d-block">Email</small>
            <p className="mb-0">
              <i className="bi bi-envelope me-1"></i>
              {application.email}
            </p>
          </div>

          <div className="col-6">
            <small className="text-muted d-block">Phone</small>
            <p className="mb-0">
              <i className="bi bi-phone me-1"></i>
              {application.phone}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <small className="text-muted d-block">Address</small>
          <p className="mb-0">
            <i className="bi bi-geo-alt me-1"></i>
            {application.address}
          </p>
        </div>

        {application.petName && (
          <div className="mb-3">
            <small className="text-muted d-block">Pet Requested</small>
            <p className="mb-0">
              <i className="bi bi-heart me-1"></i>
              {application.petName} ({application.petType})
            </p>
          </div>
        )}

        {/* Example safe usage if pet object is passed */}
        {pet && (
          <div className="mb-3">
            <small className="text-muted d-block">Pet ID (Java)</small>
            <p className="mb-0">
              <i className="bi bi-tag me-1"></i>
              {pet.id}
            </p>
          </div>
        )}

        <div className="mb-3">
          <small className="text-muted d-block">Reason for Adoption</small>
          <div className="bg-light p-3 rounded">
            <p className="mb-0">{application.adoptionReason}</p>
          </div>
        </div>

        <div className="mb-3">
          <small className="text-muted d-block">Submitted</small>
          <p className="mb-0">
            <i className="bi bi-clock me-1"></i>
            {formatTimeAgo(application.createdAt)}
          </p>
        </div>

        {application.status === 'pending' && (
          <div className="d-flex gap-2 mt-4">

            <button
              className="btn btn-success flex-grow-1"
              onClick={handleApprove}
              disabled={loading}
            >
              {loading && action === 'approving' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Approving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i>
                  Approve
                </>
              )}
            </button>

            <button
              className="btn btn-danger flex-grow-1"
              onClick={handleReject}
              disabled={loading}
            >
              {loading && action === 'rejecting' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Rejecting...
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle me-1"></i>
                  Reject
                </>
              )}
            </button>

          </div>
        )}

        {application.status !== 'pending' && (
          <div className="mt-3">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              This application has been {application.status}.
            </small>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdoptionFormCard;
