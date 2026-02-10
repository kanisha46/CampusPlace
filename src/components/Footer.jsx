import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="main-footer-light">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">CampusPlace</h2>
            <p>Connecting students. Building futures.</p>
          </div>

          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <p>+91 98765 43210</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <p>campusplace@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>© 2026 CampusPlace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}