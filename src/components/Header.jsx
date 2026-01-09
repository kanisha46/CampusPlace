import { useState, useRef, useEffect } from "react";
import "./Header.css";

export default function Header({ setPage }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notificationRef = useRef(null);

  // close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="header sticky">
      {/* Text logo */}
      <div className="logo-text-only">CampusPlace</div>

      {/* Right menu */}
      <div className="menu">
        <button className="menu-link" onClick={() => setPage("home")}>
          Home
        </button>
        <button className="menu-link" onClick={() => setPage("login")}>
          Login
        </button>

        {/* 🌙 Dark mode toggle */}
        <div
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </div>

        {/* 🔔 Bell */}
        <div
          className="bell-wrapper"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          <span className="badge">3</span>
        </div>

        {/* Notification popup */}
        {showNotifications && (
          <div className="notification-popup" ref={notificationRef}>
            <h4>Notifications</h4>
            <ul>
              <li>📢 New company added</li>
              <li>📄 Resume review completed</li>
              <li>📝 Mock test available</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
