import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { useAuthContext } from "../../hooks/useAuthContext";

const PostPetSection = () => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    description: "",
    phone: "",
  });

  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(""); // Clear error on input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFormError("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image size must be less than 5MB");
        return;
      }

      setPicture(file);
      setFileName(file.name);
      setFormError("");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.category) return "Please select a category";
    if (!formData.breed.trim()) return "Breed is required";
    if (!formData.age || formData.age <= 0) return "Valid age is required";
    if (!formData.gender) return "Please select gender";
    if (!formData.location.trim()) return "Location is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!picture) return "Please upload a pet picture";
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const error = validateForm();
    if (error) {
      setFormError(error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("category", formData.category);
      submitData.append("breed", formData.breed.trim());
      submitData.append("age", formData.age);
      submitData.append("gender", formData.gender);
      submitData.append("location", formData.location.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("phone", formData.phone.trim());
      submitData.append("file", picture);

      console.log("📤 Submitting pet for adoption...");

      const response = await fetch("http://localhost:8080/pets/submit", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to submit pet");
      }

      console.log("✅ Pet submitted successfully:", data);
      setShowPopup(true);

      // Reset form
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        category: "",
        breed: "",
        age: "",
        gender: "",
        location: "",
        description: "",
        phone: "",
      });
      setPicture(null);
      setFileName("");

      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowPopup(false), 5000);

    } catch (error) {
      console.error("❌ Error:", error);
      setFormError(error.message || "Failed to submit pet. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-warning">Post a Pet for Adoption</h2>
        <hr />
        <img
          src={assets.postPet}
          alt="Pet Looking for a Home"
          className="img-fluid"
          style={{ maxWidth: "400px" }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        {/* ERROR MESSAGE */}
        {formError && (
          <div className="alert alert-danger alert-dismissible fade show">
            <strong>⚠️ Error:</strong> {formError}
            <button
              type="button"
              className="btn-close"
              onClick={() => setFormError("")}
            ></button>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {showPopup && (
          <div className="alert alert-success alert-dismissible fade show">
            <strong>✅ Success!</strong> Pet submitted successfully! We'll review and contact you soon.
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowPopup(false)}
            ></button>
          </div>
        )}

        <div className="row">
          {/* YOUR NAME */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Your Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* YOUR EMAIL */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Your Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
            {user?.email && (
              <small className="text-muted">Pre-filled from account</small>
            )}
          </div>

          {/* PET CATEGORY */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Pet Category <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose Category</option>
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Bird">Bird</option>
              <option value="Fish">Fish</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* BREED */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Breed <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              placeholder="e.g., Labrador, Persian"
              required
            />
          </div>

          {/* PET AGE */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Pet Age (years) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age in years"
              min="0"
              max="30"
              required
            />
          </div>

          {/* GENDER */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Gender <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* PET PICTURE */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Pet Picture <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {fileName && (
              <small className="text-success d-block mt-1">
                ✓ Selected: {fileName}
              </small>
            )}
          </div>

          {/* LOCATION */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Location <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State"
              required
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9876543210"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">
              Why are you giving up this pet? <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please explain your reason..."
              required
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="d-flex justify-content-center mt-4">
          <button
            type="submit"
            className="btn btn-warning rounded-pill text-white btn-lg px-5 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting...
              </>
            ) : (
              "Submit Your Pet"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PostPetSection;
