import { Bell, Moon, Sun, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

export default function Header() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <header className="header sticky">
      <div className="logo">
        <div className="logo-circle">CP</div>
        <span>Campus<span>Place</span></span>
      </div>

      <nav className={`menu ${open ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/questions">Questions</Link>
      </nav>

      <div className="actions">
        <Bell size={18} />
        <button className="icon-btn" onClick={toggleDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/login" className="login-btn">Login</Link>

        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
