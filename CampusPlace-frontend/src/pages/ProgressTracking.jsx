import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProgressTracking.css";
import ProgressCharts from "../components/ProgressCharts";

const API = "http://localhost:8082";

const MOCK = {
  totalTests: 14,
  averageScore: 76,
  accuracy: 82,
  strongTopic: "Data Structures",
  weakTopic: "Operating Systems",
  streak: 5,
  rank: 23,
  totalStudents: 210,
  recentTests: [
    { id: 1, quizTitle: "DSA Basics", score: 88, date: "2026-03-24" },
    { id: 2, quizTitle: "OS Concepts", score: 62, date: "2026-03-22" },
    { id: 3, quizTitle: "DBMS Fundamentals", score: 79, date: "2026-03-20" },
    { id: 4, quizTitle: "Networking", score: 91, date: "2026-03-18" },
    { id: 5, quizTitle: "System Design", score: 55, date: "2026-03-15" },
  ],
};

function ScoreRing({ value, label, color }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <div className="score-ring-wrap">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
          className="ring-progress"
        />
        <text x="48" y="53" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">{value}%</text>
      </svg>
      <span className="score-ring-label">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accentClass }) {
  return (
    <div className={`pt-stat-card ${accentClass}`}>
      <div className="pt-stat-icon">{icon}</div>
      <div className="pt-stat-body">
        <span className="pt-stat-value">{value}</span>
        <span className="pt-stat-label">{label}</span>
        {sub && <span className="pt-stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

function getBadge(score) {
  if (score >= 90) return { label: "🏆 Excellent", cls: "badge-gold" };
  if (score >= 75) return { label: "✅ Good", cls: "badge-teal" };
  if (score >= 60) return { label: "⚡ Average", cls: "badge-amber" };
  return { label: "📉 Needs Work", cls: "badge-red" };
}

function ProgressTracking() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
    } catch {
      // use mock data for demo
      setProgress(MOCK);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-loading-screen">
        <div className="pt-spinner" />
        <p>Loading your analytics...</p>
      </div>
    );
  }

  const p = progress;

  return (
    <div className="pt-wrapper">

      {/* ── HERO BANNER ── */}
      <div className="pt-hero">
        <div className="pt-hero-bg-orbs">
          <span className="orb orb1" />
          <span className="orb orb2" />
          <span className="orb orb3" />
        </div>
        <div className="pt-hero-content">
          <div className="pt-hero-left">
            <p className="pt-hero-eyebrow">📊 Analytics Dashboard</p>
            <h1 className="pt-hero-title">Your Progress Report</h1>
            <p className="pt-hero-sub">
              Track, analyse, and improve your performance across all mock tests &amp; assessments.
            </p>
            <div className="pt-hero-tags">
              <span className="pt-tag">🔥 {p.streak}-day streak</span>
              <span className="pt-tag">🏅 Rank #{p.rank ?? "—"} / {p.totalStudents ?? "—"}</span>
            </div>
          </div>
          <div className="pt-hero-rings">
            <ScoreRing value={p.averageScore} label="Avg Score" color="#C9A84C" />
            <ScoreRing value={p.accuracy} label="Accuracy" color="#26A69A" />
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="pt-tabs">
        {["overview", "charts", "history"].map((t) => (
          <button
            key={t}
            className={`pt-tab${activeTab === t ? " active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t === "overview" && "📋 Overview"}
            {t === "charts" && "📈 Charts"}
            {t === "history" && "📜 History"}
          </button>
        ))}
      </div>

      <div className="pt-body">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            <div className="pt-stats-grid">
              <StatCard icon="📝" label="Total Tests Taken" value={p.totalTests} accentClass="accent-teal" />
              <StatCard icon="🎯" label="Average Score" value={`${p.averageScore}%`} accentClass="accent-bronze" />
              <StatCard icon="✅" label="Overall Accuracy" value={`${p.accuracy}%`} accentClass="accent-teal" />
              <StatCard icon="🔥" label="Current Streak" value={`${p.streak ?? 0} days`} sub="Keep it up!" accentClass="accent-bronze" />
              <StatCard icon="💪" label="Strong Topic" value={p.strongTopic || "—"} accentClass="accent-green" />
              <StatCard icon="⚠️" label="Weak Topic" value={p.weakTopic || "—"} sub="Focus here" accentClass="accent-red" />
            </div>

            {/* Progress bar section */}
            <div className="pt-section-card">
              <h2 className="pt-section-title">Performance Breakdown</h2>
              <div className="pt-bar-group">
                <ProgressBar label="Strong Topics Mastery" value={p.averageScore} color="#26A69A" />
                <ProgressBar label="Weak Area Coverage" value={100 - p.accuracy} color="#C9A84C" />
                <ProgressBar label="Test Completion Rate" value={Math.min(p.totalTests * 7, 100)} color="#7C3AED" />
              </div>
            </div>
          </>
        )}

        {/* ── CHARTS TAB ── */}
        {activeTab === "charts" && (
          <div className="pt-section-card pt-charts-wrap">
            <h2 className="pt-section-title">Performance Charts</h2>
            <ProgressCharts tests={p.recentTests} />
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <div className="pt-section-card">
            <h2 className="pt-section-title">Recent Mock Tests</h2>
            <div className="pt-table-wrap">
              <table className="pt-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Test Name</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {p.recentTests && p.recentTests.map((t, i) => {
                    const bdg = getBadge(t.score);
                    return (
                      <tr key={t.id} className="pt-table-row">
                        <td className="pt-td-num">{i + 1}</td>
                        <td className="pt-td-title">{t.quizTitle}</td>
                        <td>
                          <span className="pt-score-pill">{t.score}%</span>
                        </td>
                        <td className="pt-td-date">{t.date}</td>
                        <td><span className={`pt-badge ${bdg.cls}`}>{bdg.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div className="pt-bar-item">
      <div className="pt-bar-header">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="pt-bar-track">
        <div
          className="pt-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default ProgressTracking;