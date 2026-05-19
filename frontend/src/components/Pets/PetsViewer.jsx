import React, { useState } from "react";
import AdoptForm from "../AdoptForm/AdoptForm";

const API_URL = import.meta.env.VITE_API_URL;

const PetsViewer = ({ pet }) => {
  const [showPopup, setShowPopup] = useState(false);

  const imageUrl = pet.image_url
    ? pet.image_url
    : "https://placehold.co/300x200?text=No+Image";

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
            onClick={() => setShowPopup(true)}
          >
            Show Interest <i className="fa fa-paw"></i>
          </button>
        </div>
      </div>

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