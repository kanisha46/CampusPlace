import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");

  // Load theme from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldDark = saved === "dark";
    setIsDarkMode(shouldDark);
    document.body.classList.toggle("dark", shouldDark);
  }, []);

  // Scroll header style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setShowDropdown(false);
    navigate("/login");
    window.location.reload();
  };

  // Stable theme toggle + save
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const scrollToTop = () => {
    setActiveSection("home");

    // ✅ Always go to home page first (important if you are on /dashboard or /companies)
    if (location.pathname !== "/") {
      navigate("/");
      // Wait a tick for Home to render, then scroll
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ UPDATED: About scroll works from any page
const scrollToAbout = () => {
  setActiveSection("about");

  const go = () => {
    const el = document.getElementById("about-us");
    if (!el) return;

    // ✅ Exact header offset (your header is 70–82px)
    const headerOffset = 75;

    // ✅ Bring section closer to header like your 1st screenshot
    const extraLift = -80; // reduce the gap above heading (try 100–160)

    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      headerOffset -
      extraLift;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  // If user is not on home page, go home first then scroll
  if (location.pathname !== "/") {
    navigate("/");
    setTimeout(go, 250);
  } else {
    go();
  }
};

  return (
    <header className={`main-header ${scrolled ? "is-scrolled" : "at-top"}`}>
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="logo-link" onClick={scrollToTop}>
          <span className="styled-logo-text">CampusPlace</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${activeSection === "home" ? "active" : ""}`}
            onClick={scrollToTop}
            type="button"
          >
            HOME
          </button>

          <NavLink to="/dashboard" onClick={() => setActiveSection("dashboard")}>
            DASHBOARD
          </NavLink>

          <NavLink to="/companies" onClick={() => setActiveSection("companies")}>
            COMPANIES
          </NavLink>

          <button
            className={`nav-link-custom ${
              activeSection === "about" ? "active" : ""
            }`}
            onClick={scrollToAbout}
            type="button"
          >
            ABOUT US
          </button>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} type="button">
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {!isLoggedIn ? (
            <Link to="/login" className="btn-login-only">
              LOGIN
            </Link>
          ) : (
            <div className="profile-wrapper">
              <div
                className="avatar-ring"
                onClick={() => setShowDropdown(!showDropdown)}
                role="button"
                tabIndex={0}
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
                  <button onClick={() => navigate("/dashboard")} type="button">
                    My Dashboard
                  </button>
                  <button onClick={handleLogout} className="logout-btn" type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
