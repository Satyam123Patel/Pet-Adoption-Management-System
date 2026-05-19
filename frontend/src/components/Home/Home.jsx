//1
import React from 'react'
import HomeLandingContainer from './HomeLandingContainer'
import CardBelowHome from './CardBelowHome'
import PlanningToAdoptAPet from './PlanningToAdoptAPet'

const Home = (props) => {
  return (
    <div>
      <HomeLandingContainer description={props.description}/>
      <CardBelowHome/>
      <PlanningToAdoptAPet/>
    </div>
  )
}

export default Home
