import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import AboutUs from "./AboutUs";
// Removed: import Dashboard from './pages/Dashboard'; (Not needed for navigation)
import "./Home.css";

const dashboardItems = [
  { id: 1, title: "Student Dashboard", desc: "Track your preparation progress and drives.", icon: "🎓", path: "/dashboard" },
  { id: 2, title: "Company & Placements", desc: "Browse companies and placement insights.", icon: "💼" },
  { id: 3, title: "Question Bank", desc: "Practice real interview questions.", icon: "❓",path: "/questions" },
  { id: 4, title: "Resume Analysis", desc: "Get AI-powered feedback.", icon: "📄" },
  { id: 5, title: "Progress Tracking", desc: "Monitor your learning journey.", icon: "📈" },
  { id: 6, title: "Mock test", desc: "Practice with quiz and code", icon: "🎙️" },
];

export default function Home({ setAboutVisible }) {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="home-container">
      {/* DASHBOARD BLOCKS */}
      <div id="explore-section" className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <div
            className={`feature-card-block accent-${index}`}
            key={item.id}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              cursor: item.path ? "pointer" : "default" 
            }}
            onClick={() => item.path && navigate(item.path)} // Navigate on click
          >
            <div className="icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ABOUT US */}
      <AboutUs onVisible={setAboutVisible} />
      
    </div>
  );
}