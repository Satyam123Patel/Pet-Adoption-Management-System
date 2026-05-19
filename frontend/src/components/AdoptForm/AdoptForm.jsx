import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function AdoptForm(props) {
  const { user } = useAuthContext();

  const [email, setEmail] = useState(user?.email || "");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");

  const [formError, setFormError] = useState(false);
  const [ErrPopup, setErrPopup] = useState(false);
  const [SuccPopup, setSuccPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !phoneNo || !livingSituation || !previousExperience || !familyComposition) {
      setFormError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(false);

      const response = await fetch(`${API_URL}/adoptions/${props.pet.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit adoption request");
      }

      setSuccPopup(true);
      setErrPopup(false);
      setPhoneNo("");
      setLivingSituation("");
      setPreviousExperience("");
      setFamilyComposition("");

      setTimeout(() => {
        props.closeForm();
      }, 2000);

    } catch (err) {
      console.error("❌ Adoption error:", err);
      setErrPopup(true);
      setSuccPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-lg">
        <div className="card-header bg-warning text-white text-center">
          <h4>Pet Adoption Application</h4>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4 text-center">
              <img
                src={props.pet.image_url || "https://placehold.co/200x200?text=Pet"}
                alt={props.pet.name}
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/200x200?text=Pet";
                }}
              />
            </div>

            <div className="col-md-8">
              <h5 className="text-warning">{props.pet.name}</h5>
              <p><b>Breed:</b> {props.pet.breed}</p>
              <p><b>Age:</b> {props.pet.age} years</p>
              <p><b>Gender:</b> {props.pet.gender}</p>
              <p><b>Category:</b> {props.pet.category}</p>
            </div>
          </div>

          {formError && (
            <div className="alert alert-danger alert-dismissible fade show">
              Please fill out all fields.
              <button type="button" className="btn-close" onClick={() => setFormError(false)}></button>
            </div>
          )}

          {ErrPopup && (
            <div className="alert alert-danger alert-dismissible fade show">
              Oops! Something went wrong. Please try again.
              <button type="button" className="btn-close" onClick={() => setErrPopup(false)}></button>
            </div>
          )}

          {SuccPopup && (
            <div className="alert alert-success alert-dismissible fade show">
              Adoption request for <b>{props.pet.name}</b> submitted successfully!
              <button type="button" className="btn-close" onClick={() => setSuccPopup(false)}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
              <small className="text-muted">
                {user?.email ? "Pre-filled from your account" : "Enter your email"}
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Pet Living Situation *</label>
              <textarea
                className="form-control"
                rows="2"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
                placeholder="Describe where the pet will live"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Previous Pet Experience *</label>
              <textarea
                className="form-control"
                rows="2"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                placeholder="Tell us about your experience with pets"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Any Other Pets *</label>
              <textarea
                className="form-control"
                rows="2"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
                placeholder="Do you have other pets?"
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <button type="submit" className="btn btn-warning text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                ) : (
                  "Submit Application"
                )}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={props.closeForm} disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer text-center bg-light">
          <small className="text-muted">All fields are required. We'll review your application and contact you soon.</small>
        </div>
      </div>
    </div>
  );
}

export default AdoptForm;