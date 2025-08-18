import React from "react";
import "./joint_venture.css";
import img_bcas from "./img_bcas_home.png";
import img_airports from "./img_airports_home.png";
import img_dgca from "./img_dgca.png";

const JointVenture = () => {
  return (
    <div className="joint-venture-container">
      <h2 className="joint-venture-title">Joint Venture Partners</h2>
      <div className="joint-venture-logos">
        <div className="joint-venture-card">
          <img src={img_bcas} alt="BCAS" className="joint-venture-img" />
        </div>
        <div className="joint-venture-card">
          <img src={img_airports} alt="AAI" className="joint-venture-img" />
        </div>
        <div className="joint-venture-card">
          <img src={img_dgca} alt="DGCA" className="joint-venture-img" />
        </div>
      </div>
    </div>
  );
};

export default JointVenture; 