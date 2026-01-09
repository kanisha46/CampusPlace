import "./Home.css";
import {
  GraduationCap,
  Briefcase,
  HelpCircle,
  Brain,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <h1>
          Everything You Need to <span>Succeed</span>
        </h1>
        <p>Comprehensive tools for your placement journey</p>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="grid">
          <Card icon={<GraduationCap />} title="Student Dashboard" desc="Track your preparation progress and drives" />
          <Card icon={<Briefcase />} title="Company & Placements" desc="Browse companies and placement insights" />
          <Card icon={<HelpCircle />} title="Question Bank" desc="Practice real interview questions" />
          <Card icon={<Brain />} title="AI Question Generator" desc="Generate tailored practice questions" />
          <Card icon={<FileText />} title="Resume Analysis" desc="Get AI-powered feedback" />
          <Card icon={<TrendingUp />} title="Progress Tracking" desc="Monitor your learning journey" />
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to start your placement journey?</h2>
        <button>Get Started Now →</button>
      </section>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
