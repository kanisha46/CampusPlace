import React from "react";
import "./Hero.css";

export default function Hero() {
  const handleExplore = () => {
    document.getElementById("explore-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="hero-visual">
      <div className="hero-content">
        <h1 className="animate-pop">
          Elevate Your <span className="text-gradient">Placement</span> Journey
        </h1>
        <p>Everything you need to land your dream job, all in one place.</p>

        <div className="hero-actions-center">
          {/* ✅ scroll on click */}
          <button className="glow-btn-large" onClick={handleExplore} type="button">
            Explore Now
          </button>
        </div>
      </div>
    </section>
  );
}
