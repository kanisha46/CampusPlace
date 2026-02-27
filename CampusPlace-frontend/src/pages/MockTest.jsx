import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MockTest.css";

export default function MockTest() {

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  axios.get("http://localhost:8082/quiz/student/list")
    .then(res => {
      setQuizzes(res.data);
      setLoading(false);
    })
    .catch(err => {
      setError("Failed to load quizzes");
      setLoading(false);
    });

}, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

return (
  <div className="mock-wrapper">

    <div className="mock-header">
      <h1>Mock Tests</h1>
      <p>Practice and track your performance</p>
    </div>

    <div className="mock-grid">
      {quizzes.length === 0 && (
        <div className="empty-state">
          No quizzes available.
        </div>
      )}

      {quizzes.map(q => (
        <div key={q.id} className="quiz-card">

          <div className="quiz-card-header">
            <h3>{q.title}</h3>
            {q.attempted && (
              <span className="badge">Completed</span>
            )}
          </div>

          <div className="quiz-meta">
            <div>📘 {q.subject}</div>
            <div>⏳ {q.durationMinutes} mins</div>
          </div>

          <button
            className={q.attempted ? "view-btn" : "start-btn"}
            onClick={() => navigate(`/mock-test/${q.id}`)}
          >
            {q.attempted ? "View Result" : "Start Test"}
          </button>

        </div>
      ))}
    </div>

  </div>
);
}