//1
import React from 'react'

const Card = (props) => {
  return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="card-body">
        <h4 className="card-title text-warning fw-bold">{props.title}</h4>
        <p className="card-text text-muted">{props.description}</p>
      </div>
    </div>
  )
}

export default Card
