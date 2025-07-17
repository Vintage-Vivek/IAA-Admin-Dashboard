import React from "react";
import "./Navbar.css";
import embilumb from "../Helper/embilumb.png";
import logo2nd from "../Helper/2nd logo.png";
import aai from "../Helper/aai.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={embilumb} alt="Embilumb" className="navbar-img" />
        <img src={logo2nd} alt="2nd Logo" className="navbar-img" />
        <img src={aai} alt="AAI" className="navbar-img" />
      </div>
      <div className="navbar-center">
        <span className="navbar-title">Indian Aviation Academy</span>
        <span className="navbar-subtitle">Nurturing Aviation for the Future</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-digital">iaa HelpDesk</span>

      </div>
    </nav>
  );
};

export default Navbar;
