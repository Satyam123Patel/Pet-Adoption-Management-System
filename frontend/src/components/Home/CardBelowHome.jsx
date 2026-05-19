//1
import React from 'react'
import { assets } from '../../assets/assets';

const formatNumber = (number) => {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(('' + number).length / 3);
  const shortNumber = parseFloat((number / Math.pow(1000, suffixNum)).toFixed(1));
  return shortNumber >= 1 ? `${shortNumber}${suffixes[suffixNum]}${"+"}` : number.toString();
}

const CardBelowHome = () => {
  const adoptedPets = formatNumber(1212)

  return (
    <div className="container my-5 py-4 bg-dark text-white rounded-4">

      <div className="row align-items-center">

        {/* LEFT IMAGE */}
        <div className="col-md-3 text-center mb-3">
          <img
            src={assets.HomeDarkCardLeftPic}
            alt="Dog with toy"
            className="img-fluid rounded"
          />
        </div>

        {/* LEFT TEXT */}
        <div className="col-md-3 text-center mb-3">
          <h2 className="fw-bold display-6">{adoptedPets}</h2>
          <h4 className="mt-2 fw-bold">
            Furry Friends <br /> Living Their Best Lives
          </h4>
        </div>

        {/* RIGHT IMAGE */}
        <div className="col-md-3 text-center mb-3">
          <img
            src={assets.HomeDarkCardRightPic}
            alt="Dog"
            className="img-fluid rounded"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="col-md-3 text-center mb-3">
          <h5 className="fw-bold text-warning">WHAT WE DO?</h5>
          <p className="mt-2">
            With a focus on matching the right pet with the right family,
            PawFinds makes it easy to adopt love and foster happiness.
          </p>
        </div>

      </div>

    </div>



  )
}

export default CardBelowHome
