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
    <div className="mock-container">
      <h2 className="mock-title">Available Mock Tests</h2>

      {quizzes.length === 0 && <p>No quizzes available.</p>}

      {quizzes.map(q => (
        <div key={q.id} className="quiz-card">
          <div className="quiz-title">{q.title}</div>
          <div className="quiz-info">
            Subject: {q.subject} <br />
            Duration: {q.durationMinutes} minutes
          </div>

          <button
            className="start-btn"
            onClick={() => navigate(`/mock-test/${q.id}`)}
          >
            Start Test
          </button>
        </div>
      ))}
    </div>
  );
}