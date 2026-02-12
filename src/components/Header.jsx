import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Check login status
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setShowDropdown(false);
    navigate("/login");
    window.location.reload(); // Ensures the header updates immediately
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <header className={`main-header ${scrolled ? "is-scrolled" : "at-top"}`}>
      <div className="nav-container">

        {/* LOGO - Preserved exactly from your original code */}
        <Link to="/" className="logo-link">
          <span className="styled-logo-text">CampusPlace</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="nav-links">
          <button
            className={activeSection === "home" ? "active nav-btn" : "nav-btn"}
            onClick={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            HOME
          </button>
          <NavLink to="/dashboard">DASHBOARD</NavLink>
          <NavLink to="/companies">COMPANIES</NavLink>
          <button
            className={`nav-link-custom ${activeSection === "about" ? "active" : ""}`}
            onClick={() => {
              document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ABOUT US
          </button>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {!isLoggedIn ? (
            <Link to="/login" className="btn-login-only">
              LOGIN
            </Link>
          ) : (
            /* PROFILE LOGO ONLY (No PRO tag) */
            <div className="profile-wrapper">
              <div 
                className="avatar-ring" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kanisha" 
                  alt="Profile" 
                  className="profile-img"
                />
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-info">
                    <p>Kanisha Jasoliya</p>
                  </div>
                  <hr />
                  <button onClick={() => navigate("/dashboard")}>My Dashboard</button>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}