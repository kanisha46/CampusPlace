import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"; // Reuse existing neat styling

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:8082/quiz/student/list");
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header">
        <div>
          <h1>Welcome, {user?.name || "Faculty"}!</h1>
          <p>Faculty Dashboard - Manage your tests and track students</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="card-icon">📚</div>
          <h3>Manage Mock Tests</h3>
          <p>Create and monitor technical mock tests</p>
          <button
            className="card-action-btn"
            onClick={() => navigate("/mock-test")}
          >
            View / Add Tests
          </button>
        </div>

        <div className="dash-card">
          <div className="card-icon">📈</div>
          <h3>Active Quizzes</h3>
          <p>{loading ? "Loading..." : `${quizzes.length} Total Quizzes Available`}</p>
        </div>
      </div>
    </div>
  );
}
