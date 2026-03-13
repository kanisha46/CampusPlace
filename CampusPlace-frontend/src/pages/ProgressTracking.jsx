import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProgressTracking.css";
import ProgressCharts from "../components/ProgressCharts";

const API = "http://localhost:8082";

function ProgressTracking() {

  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/progress`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProgress(res.data);

    } catch (err) {
      console.error("Error fetching progress", err);
    }
  };

  if (!progress) return <div className="loading">Loading Progress...</div>;

  return (
    <div className="progress-container">

      <h1 className="title">📊 Progress Analytics</h1>

      {/* SUMMARY CARDS */}

      <div className="summary-grid">

        <div className="summary-card">
          <h3>Total Tests</h3>
          <p>{progress.totalTests}</p>
        </div>

        <div className="summary-card">
          <h3>Average Score</h3>
          <p>{progress.averageScore}%</p>
        </div>

        <div className="summary-card">
          <h3>Accuracy</h3>
          <p>{progress.accuracy}%</p>
        </div>

        <div className="summary-card">
          <h3>Strong Topic</h3>
          <p>{progress.strongTopic || "-"}</p>
        </div>

        <div className="summary-card">
          <h3>Weak Topic</h3>
          <p>{progress.weakTopic || "-"}</p>
        </div>

      </div>


      {/* CHARTS */}

      <ProgressCharts tests={progress.recentTests}/>


      {/* RECENT TEST TABLE */}

      <div className="recent-tests">

        <h2>Recent Mock Tests</h2>

        <table>

          <thead>
            <tr>
              <th>Test</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {progress.recentTests && progress.recentTests.map((t) => (
              <tr key={t.id}>
                <td>{t.quizTitle}</td>
                <td>{t.score}%</td>
                <td>{t.date}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ProgressTracking;