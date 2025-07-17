import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header-bg">
      <div className="logo-container">
        <div className="logo-rows">
          <div className="logo-row">
            <span className="logo-i">i</span>
            <span className="logo-text logo-black">ndian</span>
          </div>
          <div className="logo-row">
            <span className="logo-a-yellow">a</span>
            <span className="logo-text logo-black">viation</span>
          </div>
          <div className="logo-row">
            <span className="logo-a-blue">a</span>
            <span className="logo-text logo-black">cademy</span>
          </div>
        </div>
      </div>
    </header>
  );
}

