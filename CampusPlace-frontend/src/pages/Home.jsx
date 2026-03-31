import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AboutUs from "./AboutUs";
import "./Home.css";

const dashboardItems = [
  { id: 0, title: "Faculty Management", desc: "Manage your professional profile and departmental quizzes.", icon: "👨‍🏫", path: "/faculty" },
  { id: 1, title: "Student Dashboard", desc: "Real-time analytics across your entire preparation journey.", icon: "🌌", path: "/dashboard" },
  { id: 2, title: "Company & Placements", desc: "Discover tier-1 companies and predictive placement insights.", icon: "🏢", path: "/companies" },
  { id: 3, title: "Question Bank", desc: "Master complex algorithms with our high-precision databank.", icon: "⚡", path: "/questions" },
  { id: 4, title: "Resume Analysis", desc: "Hyper-accurate AI feedback on your professional portfolio.", icon: "📄", path: "/resume-analysis" },
  { id: 5, title: "Progress Tracking", desc: "Visual node mapping of your current skills against target roles.", icon: "📈", path: "/progress" },
  { id: 6, title: "Mock Test Engine", desc: "Compute parallel scenarios with our multiple AI agents.", icon: "🎙️", path: "/mock-test" },
];

export default function Home({ setAboutVisible }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const filteredDashboardItems = user?.role === "FACULTY" 
    ? dashboardItems.filter(item => 
        item.title !== "Student Dashboard" && 
        item.title !== "Progress Tracking" &&
        item.title !== "Resume Analysis"
      )
    : dashboardItems.filter(item => item.title !== "Faculty Management");

  // Handle scroll reveal animation
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    const cube = document.querySelector(".cube");
    if (cube) {
      cube.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    }
  };

  return (
    <div className="home-container">
      {/* ABSTRACT NEON HERO SECTION */}
      <div className="hero-neon-section">
        <div className="hero-content reveal">
          <div className="hero-badge-neon">
            <span className="live-dot"></span> NEXT-GEN PREDICTION ENGINE
          </div>
          <h1 className="hero-title">
            Unlock your<br/>
            <span className="hero-gradient">Ultimate Potential</span>
          </h1>
          <p className="hero-subtitle">
            Experience the pinnacle of career routing. Our neural architecture maps your unique skills into a highly accurate, dynamic career roadmap.
          </p>
          <button className="hero-btn" onClick={() => document.getElementById("explore-section")?.scrollIntoView({ behavior: 'smooth' })}>
            Ignite Engine
          </button>
        </div>
        
        <div className="hero-graphic reveal">
          <div
            className="cube-wrapper"
            onMouseMove={handleMouseMove}
          >
            <div className="cube">
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face right"></div>
              <div className="cube-face left"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>
          </div>
          <div className="glow-ring ring-1"></div>
          <div className="glow-ring ring-2"></div>
        </div>
      </div>

      {/* DASHBOARD BLOCKS */}
      <div id="explore-section" className="dashboard-grid-neon">
        {filteredDashboardItems.map((item, index) => (
          <div
            className="feature-card-neon"
            key={item.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => item.path && navigate(item.path)}
          >
            <div className="card-border-gradient"></div>
            <div className="card-content">
              <div className="icon-neon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ABOUT US */}
      <AboutUs onVisible={setAboutVisible} />
    </div>
  );
}