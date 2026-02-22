import React, { useState, useEffect } from "react";
import "./ResumeAnalysis.css";

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch Resume History
  useEffect(() => {
    fetch("http://localhost:8082/api/resume/history", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(() => {});
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8082/api/resume/analyze",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
      setHistory((prev) => [data, ...prev]);
    } catch (error) {
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  const progress = result ? result.overallScore : 0;

  return (
    <div className="resume-page">
      <div className="resume-container">

        {/* LEFT SIDE */}
        <div className="resume-left">
          <span className="resume-badge">RESUME CHECKER</span>
          <h1>Is your resume good enough?</h1>
          <p>
            Get instant AI-driven insights to optimize your resume
            and maximize interview chances.
          </p>

          {/* Drag & Drop Box */}
          <div
            className="upload-card"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
          >
            <p>
              Drag & drop your resume here or choose a file. <br />
              <strong>PDF only. Max 2MB.</strong>
            </p>

            <input
              type="file"
              accept=".pdf"
              id="resumeInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              className="upload-btn"
              onClick={() =>
                document.getElementById("resumeInput").click()
              }
            >
              Select Resume
            </button>

            {file && (
              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={loading}
                style={{ marginTop: "10px" }}
              >
                {loading ? "Analyzing..." : "Upload & Analyze"}
              </button>
            )}

            <div className="privacy">🔒 Privacy guaranteed</div>
          </div>
        </div>

        {/* RIGHT SIDE - Animated Score */}
        <div className="resume-right">
          <div className="score-card">
            <h3>Resume Score</h3>

            <div className="progress-circle">
              <svg width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#eee"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#22c55e"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={440}
                  strokeDashoffset={
                    440 - (440 * progress) / 100
                  }
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="score-text">
                {progress}/100
              </div>
            </div>

            {result && (
              <ul>
                <li>ATS: {result.atsScore}</li>
                <li>Content: {result.contentScore}</li>
                <li>Skills: {result.skillsScore}</li>
                <li>Format: {result.formatScore}</li>
                <li>Style: {result.styleScore}</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Resume History Section */}
      {history.length > 0 && (
        <section className="history-section">
          <h2>Your Resume History</h2>
          {history.map((item, index) => (
            <div key={index} className="history-card">
              <strong>{item.fileName}</strong>
              <span>{item.overallScore}/100</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}