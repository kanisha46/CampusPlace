import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement,
  Tooltip, Legend, Filler
);

const TEAL   = "#26A69A";
const BRONZE = "#C9A84C";
const PURPLE = "#7C3AED";
const RED    = "#EF4444";
const GREEN  = "#2ED873";

const chartDefaults = {
  responsive: true,
   maintainAspectRatio: false,   // ✅ IMPORTANT FIX
  animation: { duration: 1000, easing: "easeOutQuart" },
  plugins: {
    legend: {
      labels: {
        color: "rgba(232,240,239,0.6)",
        font: { family: "Inter", size: 12, weight: "600" },
        boxWidth: 12,
        padding: 16
      }
    },
    tooltip: {
      backgroundColor: "#0F2220",
      titleColor: "#E8F0EF",
      bodyColor: "rgba(232,240,239,0.7)",
      borderColor: "rgba(201,168,76,0.3)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10
    }
  },
  scales: {
    x: {
      ticks: { color: "rgba(232,240,239,0.45)", font: { family: "Inter", size: 11 } },
      grid:  { color: "rgba(255,255,255,0.04)" }
    },
    y: {
      ticks: { color: "rgba(232,240,239,0.45)", font: { family: "Inter", size: 11 } },
      grid:  { color: "rgba(255,255,255,0.04)" },
      beginAtZero: true
    }
  }
};

const doughnutDefaults = {
  responsive: true,
   maintainAspectRatio: false,   // ✅ IMPORTANT FIX
  animation: { duration: 1000, easing: "easeOutQuart" },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "rgba(232,240,239,0.6)",
        font: { family: "Inter", size: 12, weight: "600" },
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: "#0F2220",
      titleColor: "#E8F0EF",
      bodyColor: "rgba(232,240,239,0.7)",
      borderColor: "rgba(201,168,76,0.3)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10
    }
  }
};

function ProgressCharts({ tests }) {
  if (!tests || tests.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "rgba(232,240,239,0.4)", padding: "40px 0" }}>
        No test data available yet.
      </p>
    );
  }

  const labels = tests.map(t => t.quizTitle);
  const scores = tests.map(t => t.score);
  const total  = scores.reduce((a, b) => a + b, 0);

  const lineData = {
    labels,
    datasets: [{
      label: "Score Progress",
      data: scores,
      borderColor: TEAL,
      backgroundColor: "rgba(38,166,154,0.12)",
      tension: 0.45,
      pointBackgroundColor: TEAL,
      pointBorderColor: "#0B1A19",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 9,
      fill: true
    }]
  };

  const barData = {
    labels,
    datasets: [{
      label: "Test Scores",
      data: scores,
      backgroundColor: scores.map(s =>
        s >= 80 ? `rgba(38,166,154,0.7)` :
        s >= 60 ? `rgba(201,168,76,0.7)` :
                  `rgba(239,68,68,0.7)`
      ),
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: BRONZE
    }]
  };

  const doughnutData = {
    labels: ["Correct", "Incorrect"],
    datasets: [{
      data: [total, tests.length * 100 - total],
      backgroundColor: [GREEN, RED],
      hoverBackgroundColor: [TEAL, "#F87171"],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  return (
    <div className="chart-grid">

      <div className="chart-card">
        <h3>Score Trend</h3>
        <Line data={lineData} options={chartDefaults} />
      </div>

      <div className="chart-card">
        <h3>Per-Test Scores</h3>
        <Bar data={barData} options={chartDefaults} />
      </div>

      <div className="chart-card chart-card-doughnut">
        <h3>Performance Ratio</h3>
        <div className="doughnut-wrapper">
          <Doughnut data={doughnutData} options={doughnutDefaults} />
        </div>
      </div>

    </div>
  );
}

export default ProgressCharts;