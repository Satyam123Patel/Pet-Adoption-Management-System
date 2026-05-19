//1
import React from 'react'
import {Link} from 'react-router-dom'
import { assets } from '../../assets/assets';

const HomeLandingContainer = (props) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div>
      <div className="container py-5">

        <div className="row align-items-center">

          {/* LEFT SIDE */}
          <div className="col-md-6 mb-4">

            <h1 className="fw-bold display-4 ">
              <span className="d-flex align-items-center gap-2">
                Your Pets <img src={assets.homepageDog} alt="Dog" className="img-fluid" style={{ width: "45px" }} />
              </span>
              Are Our <br /> Priority
            </h1>

            <p className="text-muted mt-3">{props.description}</p>

            <Link to="/pets" className='text-decoration-none'>
              <button className="btn btn-warning rounded-pill text-white btn-lg mt-3 d-flex align-items-center gap-2"
                onClick={scrollToTop}>
                Adopt a Pet
                <img src={assets.footPrint} alt="footprint" style={{ width: "30px" }} />
              </button>
            </Link>

          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="col-md-6 text-center">
            <img src={assets.girlHoldingADog} alt="Girl holding a Dog" className="img-fluid rounded-3" />
          </div>

        </div>

      </div>
    </div>
  )
}

export default HomeLandingContainer
