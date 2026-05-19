//1
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({children}) => {
  return (
    <>
      <Navbar title="PawPals"/>
      {children}
      <Footer title="Pawpals"/>
    </>
  )
}

export default Layout
