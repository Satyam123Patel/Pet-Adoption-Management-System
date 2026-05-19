//1
import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = (props) => {
  return (
    <footer className="bg-secondary-subtle  py-4 mt-5">
      <div className="container text-center">

        {/* Logo + Title */}
        <Link to="/" className="d-inline-flex align-items-center text-dark text-decoration-none mb-3">
          <img
            src={assets.logo}
            alt="PawPals Logo"
            className="me-2"
            style={{ height: "45px" }}
          />
          <h3 className="m-0">{props.title}</h3>
        </Link>

        {/* Contact Email */}
        <p className="mt-3">
          You can reach us at{" "}
          <a href="mailto:hardikbansla@gmail.com" className="text-dark fw-bold text-decoration-none">
            pawpals@gmail.com
          </a>
        </p>

        {/* Social Links */}
        <p className="mb-2">
          <a
            href="https://www.linkedin.com/in/utkarsh-phalphale-8386182a5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark fw-bold text-decoration-none me-3"
          >
            <FontAwesomeIcon icon={faLinkedin} className='me-1'/> LinkedIn
          </a>

          <a
            href="https://github.com/Hardik609/Pet-Adoption-Management-System"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark fw-bold text-decoration-none me-3"
          >
            <FontAwesomeIcon icon={faGithub} className='me-1'/> GitHub
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark fw-bold text-decoration-none me-3"
          >
            <FontAwesomeIcon icon={faInstagram} className='me-1'/> Instagram
          </a>

          <a
            href="https://www.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark fw-bold text-decoration-none"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="me-1" /> WhatsApp
          </a>
        </p>

        {/* Copyright */}
        <p className="small text-dark mb-0">&copy; 2025 pawpals.com - All Rights Reserved</p>

      </div>
    </footer>

  )
}

export default Footer
