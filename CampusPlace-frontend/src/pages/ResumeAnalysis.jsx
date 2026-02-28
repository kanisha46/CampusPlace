import React, { useState, useEffect, useCallback } from "react";
import "./ResumeAnalysis.css";

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Function to handle the API call
  const handleUpload = useCallback(async (selectedFile) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first.");
    
    // Reset previous results before starting a new analysis loop
    setResult(null); 
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8082/api/resume/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        const text = await response.text();
        throw new Error(text || "Analysis Failed.");
      }

      const data = await response.json();

      // === DEBUGGING LOGS ===
      console.log("--- AI Analysis Raw Result ---");
      console.log("Overall Score:", data.overallScore);
      console.log("Projects Found by AI:", data.projectsFound);
      console.log("Extracted Skills:", data.skills);
      console.log("Suitable Roles Match:", data.suitableRoles);
      console.log("Missing Skills:", data.missingSkills);
      console.log("Raw Feedback:", data.aiFeedback || data.feedback);
      // ======================

      setResult(data); 
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Analysis Error: " + error.message);
      setFile(null); // Reset file so user can re-try if it fails
    } finally {
      setLoading(false);
    }
  }, []);

  // Watches for file selection to trigger the analysis automatically
  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file, handleUpload]);

  const getScore = (val) => {
    const num = parseInt(val);
    return isNaN(num) ? 0 : num;
  };

  const progress = result ? getScore(result.overallScore) : 0;
  const getScoreCategory = (score) => {
  if (score >= 85) return { label: "Excellent", color: "#10b981" };
  if (score >= 70) return { label: "Good", color: "#6366f1" };
  if (score >= 50) return { label: "Needs Improvement", color: "#f59e0b" };
  return { label: "Poor", color: "#ef4444" };
};

const scoreCategory = getScoreCategory(progress);
  return (
    <div className="resume-page light-theme">
      <div className="resume-container">
        <div className="resume-left">
          <span className="resume-badge">REAL-TIME ANALYSIS</span>
          <h1>Resume Intelligence</h1>
          <p>Select any PDF to instantly recalculate your score. Supports multiple checks in a row.</p>

          <div className="upload-card">
            <p>
              {file ? <strong>Active Selection: {file.name}</strong> : "Browse storage for a PDF."}
              <br />
              <small>Analysis triggers automatically on every selection.</small>
            </p>
            
            <input 
              type="file" 
              accept=".pdf" 
              id="resumeInput" 
              style={{ display: "none" }} 
              onChange={(e) => setFile(e.target.files[0])} 
            />
            
            <div className="button-group">
              <button 
                className="upload-btn secondary" 
                onClick={() => {
                  // Reset input value to allow re-selecting the same file if needed
                  document.getElementById("resumeInput").value = null;
                  document.getElementById("resumeInput").click();
                }}
                disabled={loading}
              >
                {loading ? "AI is Analyzing..." : "Select New Resume"}
              </button>
            </div>
            <div className="privacy">🔒 Secured Cloud Processing</div>
          </div>

          {result && (
            <div className="ai-insights-container">
              {/* CAREER PATH MATCHING */}
              <div className="insight-group">
                <h3>🎯 Career Path Matching</h3>
                <div className="role-match-list">
                  {result.suitableRoles?.map((item, i) => (
                    <div key={i} className="role-match-row">
                      <span className="role-name-text">{item.role}</span>
                      <div className="bar-bg">
                        <div className="bar-fill" style={{ width: `${item.match}%` }}></div>
                      </div>
                      <span className="match-val">{item.match}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STUDY FOCUS */}
              <div className="insight-group focus-highlight">
                <h3>📚 Study & Improvement Focus</h3>
                <p className="study-text">{result.studyFocus}</p>
                {result.missingSkills && (
                  <div className="missing-skills-tag" style={{marginTop: '10px', fontSize: '13px'}}>
                    <strong>Missing Skills:</strong> {result.missingSkills.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Circular Score Gauge */}
        <div className="resume-right">
          <div className="score-card-white">
            <h3>Overall Score</h3>
            <div className="progress-circle">
              <svg width="180" height="180">
                <circle
                    cx="90"
                    cy="90"
                    r="75"
                    stroke="#4f46e5"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={471}
                    strokeDashoffset={471 - (471 * progress) / 100}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 0.8s ease",
                      transform: "rotate(-90deg)",
                      transformOrigin: "center"
                    }}
                  />

                <defs>
                  <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="score-text-overlay">
                <span className="current-score">{progress}</span>
                <span className="total-possible">/100</span>
              </div>

              {/* 🔥 Classification */}
              <div
                className="score-classification"
                style={{ color: scoreCategory.color }}
              >
                {scoreCategory.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}