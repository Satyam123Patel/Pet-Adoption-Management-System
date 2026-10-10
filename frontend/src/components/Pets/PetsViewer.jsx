import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import AdoptForm from "../AdoptForm/AdoptForm";

const API_URL = import.meta.env.VITE_API_URL;

const PetsViewer = ({ pet }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const imageUrl = pet.image_url
    ? pet.image_url
    : "https://placehold.co/300x200?text=No+Image";

  const handleShowInterest = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowPopup(true);
  };

  return (
    <>
      <div className="card h-100 shadow-sm">
        <img
          src={imageUrl}
          className="card-img-top"
          alt={pet.name}
          style={{ height: "200px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://placehold.co/300x200?text=No+Image";
          }}
        />

        <div className="card-body">
          <h5 className="card-title text-warning">{pet.name}</h5>
          <p className="card-text"><b>Breed:</b> {pet.breed}</p>
          <p className="card-text"><b>Age:</b> {pet.age}</p>
          <p className="card-text"><b>Gender:</b> {pet.gender}</p>
        </div>

        <div className="card-footer bg-white border-0 text-center">
          <button
            className="btn btn-warning btn-sm"
            onClick={handleShowInterest}
          >
            Show Interest <i className="fa fa-paw"></i>
          </button>
        </div>
      </div>

      {/* AUTH REQUIRED MODAL */}
      {showAuthModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title fw-bold">Sign In Required</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAuthModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <h5 className="mb-3">Want to adopt {pet.name}?</h5>
                <p className="text-muted mb-4">
                  Please sign in or create an account first to submit an adoption application.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-warning rounded-pill text-white px-4 py-2 fw-semibold"
                    onClick={() => navigate("/auth")}
                  >
                    Sign In / Sign Up
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 py-2"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADOPT FORM MODAL */}
      {showPopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adopt {pet.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AdoptForm closeForm={() => setShowPopup(false)} pet={pet} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetsViewer;