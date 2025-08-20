
import React, { useState } from "react";
import "./Navbar.css";
import embilumb from "../Helper/embilumb.png";
import logo2nd from "../Helper/2nd logo.png";
import aai from "../Helper/aai.png";
import navbarImg from "../Helper/IAA_logo.png";
import iaaMiddleLogo from "../Helper/iaa_middle_logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="https://www.iaa.edu.in/home" target="_blank" rel="noopener noreferrer">
          <img src={iaaMiddleLogo} alt="IAA Middle Logo" className="navbar-iaa-img" style={{ cursor: 'pointer' }} />
        </a>
        <div className="navbar-iaa-text">
          <span className="navbar-title">Indian Aviation Academy</span>
          <span className="navbar-subtitle">Nurturing Aviation for the Future</span>
        </div>
      </div>
      <button className="navbar-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
        <span className="navbar-hamburger-bar" />
        <span className="navbar-hamburger-bar" />
        <span className="navbar-hamburger-bar" />
      </button>
      <div className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="navbar-center">
          <div className="navbar-helpdesk">
            <img src={iaaMiddleLogo} alt="IAA Middle Logo" className="navbar-iaa-middle-logo" />
            <span className="navbar-helpdesk-text">
              <span style={{color: '#2576b7'}}>Help</span>
              <span style={{color: '#f7c948'}}>Desk</span>
            </span>
          </div>
        </div>
        <div className="navbar-right">
          <img src={embilumb} alt="Embilumb" className="navbar-img" />
          <img src={logo2nd} alt="2nd Logo" className="navbar-img" />
          <img src={aai} alt="AAI" className="navbar-img" />
        </div>
      </div>
      <div className="navbar-center navbar-center-desktop">
        <div className="navbar-helpdesk">
          <img src={iaaMiddleLogo} alt="IAA Middle Logo" className="navbar-iaa-middle-logo" />
          <span className="navbar-helpdesk-text">
            <span style={{color: '#2576b7'}}>Help</span>
            <span style={{color: '#f7c948'}}>Desk</span>
          </span>
        </div>
      </div>
      <div className="navbar-right navbar-right-desktop">
        <img src={embilumb} alt="Embilumb" className="navbar-img" />
        <img src={logo2nd} alt="2nd Logo" className="navbar-img" />
        <img src={aai} alt="AAI" className="navbar-img" />
      </div>
    </nav>
  );
};

export default Navbar;