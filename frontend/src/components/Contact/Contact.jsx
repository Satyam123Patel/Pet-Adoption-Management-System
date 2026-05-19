//1
import React from 'react'
import { assets } from '../../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone} from '@fortawesome/free-solid-svg-icons';
import "./Contact.css"


const Contact = () => {
  return (
    <div className="container my-5 py-4">

  <div className="row g-4 align-items-center">

    {/* LEFT CARD */}
    <div className="col-md-6">
      <div className="card p-4 shadow-lg border-0 rounded-4">

        <h3 className="fw-bold mb-1">Let's get in touch</h3>
        <p className="text-muted mb-4">Feel free to reach out anytime.</p>

        {/* Email */}
        <div className="d-flex align-items-center mb-3 contact-item">
          <FontAwesomeIcon icon={faEnvelope} className='me-1 envelope-icon'/>
          <a href="mailto:hardikbansla@gmail.com" className="contact-link">
            admin@pawpals.com
          </a>
        </div>

        {/* LinkedIn */}
        <div className="d-flex align-items-center mb-3 contact-item">
          <FontAwesomeIcon icon={faLinkedin} className='me-1 linkedIn-icon'/>
          <a href="https://www.linkedin.com/in/utkarsh-phalphale-8386182a5" className="contact-link">
            LinkedIn: PawPals
          </a>
        </div>

        {/* Github */}
        <div className="d-flex align-items-center mb-3 contact-item">
          <FontAwesomeIcon icon={faGithub} className='me-1 github-icon'/>
          <a href="https://github.com/Hardik609/Pet-Adoption-Management-System" className="contact-link">
            GitHub: Pawpals
          </a>
        </div>

        {/* Instagram */}
        <div className="d-flex align-items-center mb-3 contact-item">
          <FontAwesomeIcon icon={faInstagram} className='me-1 insta-icon'/>
          <a href="https://www.instagram.com" className="contact-link">
            Instagram: @PawPals_x
          </a>
        </div>

        {/* Phone */}
        <div className="d-flex align-items-center mb-1 contact-item">
          <FontAwesomeIcon icon={faPhone} className='me-1 phone-icon'/>
          <a href="tel:+91 9302601702" className="contact-link">
            +91 8010710536
          </a>
        </div>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="col-md-6 text-center">
      <img
        src={assets.devloperPng}
        alt="Profile"
        className="img-fluid rounded-4 shadow-lg"
        style={{ maxWidth: "85%" }}
      />
    </div>
  </div>
</div>


  )
}

export default Contact
