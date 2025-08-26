import React from "react";
import "./footer.css";
import iaaLogo from "./iaa_middle_logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <a 
            href="https://www.iaa.edu.in/home" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-logo-link"
          >
            <img src={iaaLogo} alt="IAA Logo" className="footer-logo" />
          </a>
        </div>
        
        <div className="footer-section">
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6736.786928595438!2d77.140055!3d28.530099!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c72fb860727%3A0xa793309dbc24f52!2sIndian%20Aviation%20Academy!5e1!3m2!1sen!2sin!4v1753678292960!5m2!1sen!2sin" 
              width="400" 
              height="250" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="IAA Location"
            ></iframe>
          </div>
        </div>
        
        <div className="footer-section">
          <h3 className="quick-links-title">Quick Links</h3>
          <ul className="quick-links-list">
            <li>
              <a 
                href="https://www.iaa.edu.in/faq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="quick-link"
              >
                FAQ
              </a>
            </li>
            <li>
              <a 
                href="https://www.iaa.edu.in/contact-us" 
                target="_blank" 
                rel="noopener noreferrer"
                className="quick-link"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">
          Copyright @ 2024. All Right Reserved By Indian Aviation Academy. Design and Developed By @VK
        </p>
        <p className="last-updated">
          Last Updated: 26 Aug 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer; 