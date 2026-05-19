import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const Profile = () => {
  const { user, dispatch } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);

  const [editValues, setEditValues] = useState({
    name: user.name,
    email: user.email,
  });

  const [tempValues, setTempValues] = useState({
    name: user.name,
    email: user.email,
  });

  const [errors, setErrors] = useState([]);
  const [succMessage, setSuccMessage] = useState('');

  const handleChange = (e) => {
    setTempValues({ ...tempValues, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setErrors([]);
    setSuccMessage('');

    // ✅ Build request body safely
    const bodyData = {
      name: tempValues.name,
      email: user.email,
    };

    // ✅ Send newEmail ONLY if changed
    if (tempValues.email !== user.email) {
      bodyData.newEmail = tempValues.email.toLowerCase();
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        }
      );

      // ✅ SAFE JSON PARSING (FIXES YOUR ERROR)
      let data = {};
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        setErrors([data.error || 'Failed to update profile']);
        setIsEditing(false);
        return;
      }

      // ✅ Success
      setSuccMessage('Updated Successfully');

      const updatedUser = {
        ...user,
        name: data.updatedUser?.name ?? tempValues.name,
        email: data.updatedUser?.email ?? user.email,
      };

      // ✅ Update local UI state
      setEditValues({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      setTempValues({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      setIsEditing(false);

      // ✅ Update AuthContext
      dispatch({
        type: 'LOGIN',
        payload: updatedUser,
      });

      // ✅ Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err) {
      console.error('Profile update error:', err);
      setErrors(['Failed to update profile. Please try again.']);
    }
  };

  const handleEditClick = () => {
    setTempValues(editValues);
    setIsEditing(true);
    setSuccMessage('');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Profile</h5>
              {!isEditing ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSave}
                >
                  Save
                </button>
              )}
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={tempValues.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {editValues.name}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempValues.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {editValues.email}
                  </p>
                )}
              </div>

              <div className="alert alert-info mt-3">
                If you want to change your password, please log out and use the
                <strong> “Forgot Password” </strong> feature.
              </div>

              {succMessage && (
                <div className="alert alert-success mt-3">
                  {succMessage}
                </div>
              )}

              {errors.length > 0 && (
                <div className="mt-3">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className="alert alert-danger mb-2"
                    >
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;