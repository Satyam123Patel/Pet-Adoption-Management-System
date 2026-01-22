import React, { useEffect, useState } from 'react';
import PetsViewer from './PetsViewer';

const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // ✅ PUBLIC API – no token needed
        const res = await fetch("http://localhost:8080/pets");

        if (!res.ok) throw new Error('Failed to fetch pets');

        const data = await res.json();
        console.log('Fetched pets:', data);
        setPetsData(data);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError("Failed to load pets");
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // ✅ Filter by category
  const filteredPets = petsData.filter((pet) => {
    if (filter === "all") return true;
    return pet.category?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="container my-4">
      {/* Filter */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Pets</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
            <option value="rabbit">Rabbits</option>
            <option value="bird">Birds</option>
            <option value="fish">Fish</option>
          </select>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="row">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"></div>
            <p>Loading pets...</p>
          </div>
        )}

        {error && <p className="text-danger text-center">{error}</p>}

        {!loading && !error && filteredPets.length > 0 && (
          filteredPets.map((pet) => (
            <div className="col-md-3 mb-4" key={pet.id}>
              <PetsViewer pet={pet} />
            </div>
          ))
        )}

        {!loading && filteredPets.length === 0 && (
          <p className="text-center">No pets available</p>
        )}
      </div>
    </div>
  );
};

export default Pets;