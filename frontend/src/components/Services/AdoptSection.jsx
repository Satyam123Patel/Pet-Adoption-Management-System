//1
import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'


const AdoptSection = () => {
    const scrollToTop =()=>{
        window.scrollTo(0,0)
    }
    return (
        <div>
            <section className="container my-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-warning link-underline-warning">Adopt a Pet</h2><hr/>
                    <img
                        src={assets.adoptPet}
                        alt="Happy Pet"
                        className="img-fluid rounded shadow-sm mt-3"
                        style={{ maxWidth: "400px" }}
                    />
                </div>

                <p className="text-muted text-center mx-auto" style={{ maxWidth: "700px" }}>
                    Welcome to our pet adoption program! Adopting a pet is a wonderful way
                    to bring joy and companionship into your life.
                </p>

                <div className="mt-3">
                    <h3 className="fw-semibold text-center text-warning">Benefits of Pet Adoption</h3>
                    <ul className="list-group list-group-flush ms-3 d-flex align-items-center">
                        <li className="list-group-item border-0 ps-0"> Provide a loving home to a pet in need</li>
                        <li className="list-group-item border-0 ps-0"> Experience the unconditional love of a pet</li>
                        <li className="list-group-item border-0 ps-0"> Create lasting memories and cherished moments</li>
                    </ul>
                </div>

                <div className="mt-3">
                    <h3 className="fw-semibold text-center text-warning">Adoption Process</h3>
                    <ul className="list-group list-group-flush ms-3 d-flex align-items-center">
                        <li className="list-group-item border-0 ps-0">Fill out an adoption application</li>
                        <li className="list-group-item border-0 ps-0">Meet potential pets in person</li>
                        <li className="list-group-item border-0 ps-0">Complete the necessary paperwork</li>
                    </ul>
                </div>

                <div className="mt-3">
                    <h3 className="fw-semibold text-center text-warning">Responsibilities</h3>
                    <p className="text-muted text-center ">
                        Adopting a pet comes with responsibilities, including feeding, grooming,
                        regular exercise, and providing medical care.
                    </p>
                </div>

                <div className="text-center mt-3">
                    <Link to="/pets">
                        <button
                            className="btn btn-warning rounded-pill text-white btn-lg px-4 py-2 shadow-sm"
                            onClick={scrollToTop}
                        >
                            Find Your Perfect Pet
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    )
}

export default AdoptSection
