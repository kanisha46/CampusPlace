import React from "react";
import TypingText from "./TypingText";
import "./Hero.css";
import heroImage from "../assets/hero_3d.png";

export default function Hero() {
  const handleExplore = () => {
    document.getElementById("explore-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="hero-visual">
      <div className="hero-container">
        
        {/* LEFT PORTION: Custom 3D Asset and Typography */}
        <div className="hero-left">
          <div className="hero-image-wrapper">
            <img 
              src={heroImage} 
              alt="CampusPlace AI Career Platform" 
              className="hero-image" 
            />
            <div className="hero-abstract-overlay">
              <div className="overlay-badge">AI POWERED</div>
              <h2 className="overlay-typography">Elevate your profile with AI intelligence.</h2>
              <p className="overlay-sub-typography">Interactive career roadmaps & smart analysis.</p>
            </div>
            <div className="hero-glow-blob"></div>
          </div>
        </div>

        {/* RIGHT PORTION: Original Content Center/Right-Aligned */}
        <div className="hero-right">
          <div className="hero-content">
            <TypingText />
            <p className="hero-desc">Everything you need to land your dream job, all in one place.</p>
            <div className="hero-actions-center">
              <button className="glow-btn-large" onClick={handleExplore} type="button">
                Explore Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}