//1
import React from 'react'
import AdoptSection from './AdoptSection'
import PostPetSection from './PostPetSection'

const Services = () => {
  return (
    <div className='container'>
      <div className='row'>
        
        {/* Adopt a Pet Section */}
        <div className='col-md-6 d-flex align-items-center'>
          <AdoptSection />
        </div>

        {/* Post a Pet for Adoption (ONLY THIS FORM) */}
        <div className='col-md-6 d-flex align-items-center'>
          <PostPetSection />
        </div>

      </div>
    </div>
  )
}

export default Services
