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
  Legend
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function ProgressCharts({ tests }) {

  if (!tests || tests.length === 0) {
    return <p style={{textAlign:"center"}}>No data available</p>;
  }

  const labels = tests.map(t => t.quizTitle);
  const scores = tests.map(t => t.score);

  const total = scores.reduce((a,b)=>a+b,0);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Score Progress",
        data: scores,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointRadius: 6,
        fill: true
      }
    ]
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Test Scores",
        data: scores,
        backgroundColor: "#F59E0B",
        borderRadius: 8,
        hoverBackgroundColor: "#fbbf24"
      }
    ]
  };

  const doughnutData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [total, (tests.length * 10) - total],
        backgroundColor: ["#22C55E", "#EF4444"],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutQuart"
    },
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  return (

    <div className="chart-grid">

      <div className="chart-card">
        <h3>Score Progress</h3>
        <Line data={lineData} options={options}/>
      </div>

      <div className="chart-card">
        <h3>Score Distribution</h3>
        <Bar data={barData} options={options}/>
      </div>

      <div className="chart-card" style={{gridColumn:"span 2",textAlign:"center"}}>
        <h3>Performance Ratio</h3>

        <div style={{width:"280px",margin:"auto"}}>
          <Doughnut data={doughnutData} options={options}/>
        </div>

      </div>

    </div>
  );
}

export default ProgressCharts;