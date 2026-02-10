import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  const aboutItems = [
    {
      title: "Our Mission",
      icon: "🎯",
      desc: "Help students prepare smarter and crack placements confidently.",
    },
    {
      title: "Our Vision",
      icon: "🚀",
      desc: "One trusted platform for preparation, practice, and placement.",
    },
    {
      title: "What We Provide",
      icon: "🤝",
      desc: "Dashboards, companies, questions, and progress tracking.",
    },
  ];

  return (
    <section className="about-section">
      <h2>About CampusPlace</h2>
      <p className="about-subtitle">
        Your all-in-one platform for placement preparation and success.
      </p>

      <div className="about-grid">
        {aboutItems.map((item, index) => (
          <div
            className="about-card animate-about"
            key={index}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="about-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}