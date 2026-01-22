import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

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

    if (
      !email ||
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition
    ) {
      setFormError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(false);

      const response = await fetch(
        `http://localhost:8080/adoptions/${props.pet.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            phoneNo,
            livingSituation,
            previousExperience,
            familyComposition,
            petId: props.pet.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit adoption request");
      }

      const data = await response.json();
      console.log("Success:", data);

      setSuccPopup(true);
      setErrPopup(false);
      
      // Clear form after success
      setPhoneNo("");
      setLivingSituation("");
      setPreviousExperience("");
      setFamilyComposition("");

    } catch (err) {
      console.error("Adoption error:", err);
      setErrPopup(true);
      setSuccPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-lg">
        {/* Header */}
        <div className="card-header bg-warning text-white text-center">
          <h4>Pet Adoption Application</h4>
        </div>

        <div className="card-body">
          {/* Pet Details */}
          <div className="row mb-4">
            <div className="col-md-4 text-center">
              <img
                src={`http://localhost:8080/${props.pet.image_url}`}
                alt={props.pet.name}
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "/placeholder-pet.jpg";
                }}
              />
            </div>

            <div className="col-md-8">
              <h5 className="text-warning">{props.pet.name}</h5>
              <p>
                <b>Breed:</b> {props.pet.breed}
              </p>
              <p>
                <b>Age:</b> {props.pet.age} years
              </p>
              <p>
                <b>Gender:</b> {props.pet.gender}
              </p>
              <p>
                <b>Category:</b> {props.pet.category}
              </p>
            </div>
          </div>

          {/* Alerts */}
          {formError && (
            <div className="alert alert-danger alert-dismissible fade show">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Please fill out all fields.
              <button
                type="button"
                className="btn-close"
                onClick={() => setFormError(false)}
              ></button>
            </div>
          )}

          {ErrPopup && (
            <div className="alert alert-danger alert-dismissible fade show">
              <i className="bi bi-x-circle me-2"></i>
              Oops! Something went wrong. Please try again.
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrPopup(false)}
              ></button>
            </div>
          )}

          {SuccPopup && (
            <div className="alert alert-success alert-dismissible fade show">
              <i className="bi bi-check-circle me-2"></i>
              Adoption request for <b>{props.pet.name}</b> submitted successfully!
              We'll contact you soon.
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccPopup(false)}
              ></button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* ✅ EMAIL FIELD - NOW EDITABLE */}
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-envelope me-2"></i>
                Email *
              </label>
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

            {/* PHONE NUMBER */}
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-telephone me-2"></i>
                Phone Number *
              </label>
              <input
                type="tel"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>

            {/* LIVING SITUATION */}
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-house me-2"></i>
                Pet Living Situation *
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
                placeholder="Describe where the pet will live (e.g., apartment, house with yard)"
                required
              />
            </div>

            {/* PREVIOUS EXPERIENCE */}
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-clock-history me-2"></i>
                Previous Pet Experience *
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                placeholder="Tell us about your experience with pets"
                required
              />
            </div>

            {/* OTHER PETS */}
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-hearts me-2"></i>
                Any Other Pets *
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
                placeholder="Do you have other pets? If yes, please describe"
                required
              />
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                type="submit"
                className="btn btn-warning text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Submit Application
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={props.closeForm}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer text-center bg-light">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            All fields are required. We'll review your application and contact you soon.
          </small>
        </div>
      </div>
    </div>
  );
}

export default AdoptForm;