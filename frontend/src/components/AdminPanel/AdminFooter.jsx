//1
import React from 'react';

function AdminFooter() {
    return (
        <footer className="bg-dark text-white mt-auto py-3">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} Pet Adoption Management System - Admin Panel
                        </p>
                        <small className="text-muted">
                            <i className="bi bi-shield-check me-1"></i>
                            Secure Admin Interface
                        </small>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <small className="text-muted">
                            <i className="bi bi-code-slash me-1"></i>
                            Developed for Diploma Project - CDAC Bengaluru
                        </small>
                        <div className="mt-1">
                            <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>
                                System Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default AdminFooter;