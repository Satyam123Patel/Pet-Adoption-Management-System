//1
import React from 'react'
import { Link } from 'react-router-dom'

const FourOhFourPage = () => {
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-danger">404</h1>

                <p className="fs-4 text-muted mb-4">
                    Oops! The page you’re looking for does not exist.
                </p>

                <Link to="/" className="btn btn-primary btn-lg">
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default FourOhFourPage