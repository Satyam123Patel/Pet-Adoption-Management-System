//1
import React, { useState } from "react";

const SubmitPet = () => {

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    description: ""
  });

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append("file", file);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/pets/submit`,
      {
        method: "POST",
        body: data
      }
    );

    const text = await res.text();

    setMsg(text);
  };

  return (
    <div className="container mt-4">

      <h3>Submit Pet for Adoption</h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          name="name"
          placeholder="Pet Name"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="breed"
          placeholder="Breed"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="age"
          placeholder="Age"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="gender"
          placeholder="Gender"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <input
          type="file"
          className="form-control mb-2"
          onChange={handleFile}
        />

        <button className="btn btn-primary">
          Submit
        </button>

      </form>
    </div>
  );
};

export default SubmitPet;
