import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header({ isAboutVisible }) {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <header className={`main-header ${scrolled ? "is-scrolled" : "at-top"}`}>
      <div className="nav-container">
        
        {/* LOGO */}
        <Link to="/" className="logo-link">
          <div className="logo-icon-svg">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 6V18M12 6C12 6 11 4 6 4C2 4 2 8 2 8V19C2 19 2 15 6 15C11 15 12 18 12 18M12 6C12 6 13 4 18 4C22 4 22 8 22 8V19C22 19 22 15 18 15C13 15 12 18 12 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="styled-logo-text">CampusPlace</span>
        </Link>

        {/* NAV */}
        <nav className="nav-links">
  <NavLink to="/" end>HOME</NavLink>
  <NavLink to="/dashboard">DASHBOARD</NavLink>
  <NavLink to="/companies">COMPANIES</NavLink>

  {/* About Us scroll link */}
  <a
  href="/#about-us"
  className={isAboutVisible ? "active" : ""}
>
  ABOUT US
</a>
</nav>

        {/* ACTIONS */}
        <div className="header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <Link to="/login" className="btn-login-only">
            LOGIN
          </Link>
        </div>

      </div>
    </header>
  );
}