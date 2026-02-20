import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import userlogo from "../assets/userlogo.png";
import campusLogo from "../assets/campuslogo.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ Retrieve actual logged-in user's name
  const userName = localStorage.getItem("userName");

  // ✅ Helper for dynamic background color based on name
  const getAvatarStyle = (name) => {
    const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#9b59b6", "#34495e"];
    const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0;
    const bgColor = colors[charCode % colors.length];

    return {
      backgroundColor: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      color: "white",
      fontWeight: "bold",
      width: "100%",
      height: "100%",
      textTransform: "uppercase",
    };
  };

  // Load theme from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldDark = saved === "dark";
    setIsDarkMode(shouldDark);
    document.body.classList.toggle("dark", shouldDark);
  }, []);

  // Header style on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Route-aware highlight (Dashboard/Companies)
  useEffect(() => {
    if (location.pathname === "/dashboard") setActiveSection("dashboard");
    else if (location.pathname === "/companies") setActiveSection("companies");
    else if (location.pathname === "/") setActiveSection("home");
  }, [location.pathname]);

  // Scroll highlight on HOME page only
  useEffect(() => {
    if (location.pathname !== "/") return;

    const aboutEl = document.getElementById("about-us");
    if (!aboutEl) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 5) {
        setActiveSection("contact");
        return;
      }

      const aboutTop = aboutEl.getBoundingClientRect().top + window.pageYOffset;

      if (scrollTop >= aboutTop - 120) {
        setActiveSection("about");
        return;
      }

      if (scrollTop < 200) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName"); // ✅ Clear name on logout
    setShowDropdown(false);
    navigate("/login");
    window.location.reload();
  };

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
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToAbout = () => {
    setActiveSection("about");
    const go = () => {
      const el = document.getElementById("about-us");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth" });
    };
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(go, 200);
    } else {
      go();
    }
  };

  const scrollToContact = () => {
    setActiveSection("contact");
    const go = () => {
      const el = document.getElementById("contact-us");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth" });
    };
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(go, 200);
    } else {
      go();
    }
  };

  return (
    <header className={`main-header ${scrolled ? "is-scrolled" : "at-top"}`}>
      <div className="nav-container">
        {/* LOGO */}
        {/* LOGO */}
        {/* LOGO */}
        <Link to="/" className="logo-link" onClick={scrollToTop}>
          <img
            src={campusLogo}
            alt="CampusPlace Logo"
            className="campus-logo"
          />
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

          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setActiveSection("dashboard")}
          >
            DASHBOARD
          </NavLink>

          <NavLink
            to="/companies"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setActiveSection("companies")}
          >
            COMPANIES
          </NavLink>

          <button
            className={`nav-link-custom ${activeSection === "about" ? "active" : ""}`}
            onClick={scrollToAbout}
            type="button"
          >
            ABOUT US
          </button>

          <button
            className={`nav-link-custom ${activeSection === "contact" ? "active" : ""}`}
            onClick={scrollToContact}
            type="button"
          >
            CONTACT US
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
                {/* ✅ DYNAMIC AVATAR LOGIC */}
                {userName ? (
                  <div style={getAvatarStyle(userName)}>
                    {userName.charAt(0)}
                  </div>
                ) : (
                  <img
                    src={userlogo}
                    alt="Profile"
                    className="profile-img"
                  />
                )}
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-info">
                    {/* ✅ SHOW ACTUAL LOGGED IN USER NAME */}
                    <p>{userName || "User"}</p>
                  </div>
                  <hr />
                  <button onClick={() => { navigate("/dashboard"); setShowDropdown(false); }} type="button">
                    My Dashboard
                  </button>
                  <button onClick={handleLogout} className="logout-btn" type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ DASHBOARD SHORTCUT ICON (The "Empty Space" Fix) */}
          <div className="header-profile-shortcut" onClick={() => navigate("/dashboard")}>
            <img src={userlogo} alt="Go to Dashboard" className="shortcut-img" />
          </div>

        </div>
      </div>
    </header>
  );
}