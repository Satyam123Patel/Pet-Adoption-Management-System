import React from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = (props) => {

  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  }


  return (
    <nav className='navbar navbar-expand-lg bg-white shadow-sm px-4'>
        <div className='container-fluid'>

            <a className="navbar-brand d-flex align-items-center" href="/">
                <img
                    src={assets.logo}
                    alt="PawPals Logo"
                    width="45"
                    className="me-2"
                />
                <span className="fw-bold fs-5">{props.title}</span>
            </a>

            {/* Toggle Button for Mobile */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menu Links */}
            <div className="collapse navbar-collapse" id="mainNav">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fs-6">
                    <li className="nav-item mx-2 fw-bold">
                        <NavLink to="/" className={({isActive})=>`nav-link ${isActive ? "nav-active" : "rounded-pill"}`}>Home</NavLink>   
                    </li>

                    <li className="nav-item mx-2 fw-bold" >
                        <NavLink to="/services" className={({isActive})=>`nav-link ${isActive ? "nav-active" : "rounded-pill"}`}>Services</NavLink> 
                    </li>

                    <li className="nav-item mx-2 fw-bold" >
                        <NavLink to="/pets" className={({isActive})=>`nav-link ${isActive ? "nav-active" : "rounded-pill"}`}>Pets</NavLink> 
                    </li>

                    <li className="nav-item mx-2 fw-bold" >
                        <NavLink to="/profile" className={({isActive})=>`nav-link ${isActive ? "nav-active" : "rounded-pill"}`}>Profile</NavLink> 
                    </li>

                    <li className="nav-item mx-2 fw-bold">
                        <NavLink to="/contact" className={({isActive})=>`nav-link ${isActive ? "nav-active" : "rounded-pill"}`}>Contact Us</NavLink> 
                    </li>
                </ul>

                {/* Username + Logout Button */}
                    {user && (
                    <li className="nav-item d-flex align-items-center">
                        <span className="me-3 fw-semibold text-secondary">
                        Welcome {user.name}!
                        </span>
                        <button
                        onClick={handleLogout}
                        className="btn btn-warning rounded-pill text-white btn-md align-items-center gap-2"
                        >
                        Logout
                        </button>
                    </li>
                )}
            </div>
        </div>
    </nav>




    // <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
    //   <div className="container">

    //     {/* Logo + Title */}
    //     <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
    //       <img
    //         src={assets.logo}
    //         alt="PawFinds Logo"
    //         style={{ height: "45px" }}
    //       />
    //       <span className="fw-bold">{props.title}</span>
    //     </Link>

    //     {/* Mobile Toggle */}
    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="collapse"
    //       data-bs-target="#navbarNav"
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>

    //     {/* Navbar Links */}
    //     <div className="collapse navbar-collapse" id="navbarNav">
    //       <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

    //         <li className="nav-item">
    //           <Link className="nav-link" to="/">Home</Link>
    //         </li>

    //         <li className="nav-item">
    //           <Link className="nav-link" to="/services">Services</Link>
    //         </li>

    //         <li className="nav-item">
    //           <Link className="nav-link" to="/pets">Pets</Link>
    //         </li>

    //         <li className="nav-item">
    //           <Link className="nav-link" to="/profile">Profile</Link>
    //         </li>

    //         <li className="nav-item">
    //           <Link className="nav-link" to="/contact">Contact Us</Link>
    //         </li>

    //         {/* Username + Logout Button */}
    //         <li className="nav-item d-flex align-items-center">
    //           <span className="me-3 fw-semibold text-secondary">
    //             Welcome {user.userName}!
    //           </span>

    //           <button
    //             onClick={handleLogout}
    //             className="btn btn-warning px-3"
    //           >
    //             Logout
    //           </button>
    //         </li>

    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  )
}

export default Navbar
