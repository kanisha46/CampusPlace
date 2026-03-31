import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./MockTest.css";

export default function MockTest() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isFaculty = user?.role === "FACULTY";
  const [facultyDept, setFacultyDept] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadQuizzes = async () => {
      try {
        if (isFaculty) {
          const email = localStorage.getItem("email");
          const profRes = await axios.get(`http://localhost:8082/api/profile?email=${email}`);
          const dept = profRes.data?.facultyDept;
          setFacultyDept(dept || "CS");

          if (!dept) {
            setError("Please update your profile with department in Faculty Dashboard");
            setLoading(false);
            return;
          }

          const quizRes = await axios.get(`http://localhost:8082/quiz/faculty/list?dept=${dept}`);
          setQuizzes(quizRes.data);
        } else {
          // Student path
          const res = await axios.get("http://localhost:8082/quiz/student/list");
          setQuizzes(res.data);
        }
      } catch (err) {
        console.error("Failed to load quizzes:", err);
        setError("Failed to load quizzes. Please ensure your profile is set up.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [user, isFaculty]);

  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:8082/quiz/delete/${quizId}`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      alert("Failed to delete quiz");
    }
  };

  const fetchLeaderboard = async (quiz) => {
    try {
      const res = await axios.get(`http://localhost:8082/quiz/${quiz.id}/leaderboard`);
      setLeaderboardData(res.data);
      setSelectedQuiz(quiz);
      setShowLeaderboard(true);
    } catch (err) {
      alert("Failed to load leaderboard");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mock-wrapper">

      <div className="mock-header">
        <div className="mock-title-row">
          <h1>{isFaculty ? "Quiz Management" : "Mock Test Engine"}</h1>
          {isFaculty && (
            <button className="create-btn" onClick={() => navigate("/create-quiz")}>
              + Create New Quiz
            </button>
          )}
        </div>
        <p>
          {isFaculty 
            ? `Managing tests for the ${facultyDept} department` 
            : "Practice and track your performance across various technologies"}
        </p>
      </div>

<<<<<<< HEAD
      <div className={isFaculty ? "management-grid" : "mock-grid"}>
        {quizzes.length === 0 && (
          <div className="empty-state">
            {isFaculty ? "No quizzes created for your department yet." : "No quizzes available for your branch."}
          </div>
        )}

        {quizzes.map(q => (
          <div key={q.id} className={isFaculty ? "manage-card" : "quiz-card"}>

            <div className="quiz-card-header">
              <h3>{q.title}</h3>
              {!isFaculty && q.attempted && (
                <span className="badge">Completed</span>
              )}
              {isFaculty && (
                <span className="dept-tag">{facultyDept}</span>
              )}
            </div>

            <div className="quiz-meta">
              <div>📘 {q.subject}</div>
              <div>⏳ {q.durationMinutes} mins</div>
            </div>

            <div className="quiz-actions">
              <button
                className={isFaculty ? "preview-btn" : (q.attempted ? "view-btn" : "start-btn")}
                onClick={() => navigate(`/mock-test/${q.id}`)}
              >
                {isFaculty ? "Preview Quiz" : (q.attempted ? "View Result" : "Start Test")}
              </button>
              
              {isFaculty && (
                <>
                  <button 
                    className="results-btn-neon" 
                    onClick={() => fetchLeaderboard(q)}
                  >
                    View Results
                  </button>
                  <button 
                    className="delete-btn-neon" 
                    onClick={() => deleteQuiz(q.id)}
                  >
                    Delete Quiz
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* LEADERBOARD MODAL */}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="leaderboard-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Results: {selectedQuiz?.title}</h2>
              <button className="close-btn" onClick={() => setShowLeaderboard(false)}>×</button>
            </div>
            
            <div className="results-table-container">
              {leaderboardData.length === 0 ? (
                <p className="no-data">No students have attempted this quiz yet.</p>
              ) : (
                <table className="neon-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((res, index) => (
                      <tr key={res.id}>
                        <td>{index + 1}</td>
                        <td>{res.student?.name || "Student"}</td>
                        <td>{res.score}</td>
                        <td>{((res.score / (selectedQuiz?.durationMinutes || 1)) * 10).toFixed(0)}%</td> 
                        {/* Assuming 1 min ≈ 1 question for simple % if total questions not in list response */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
=======
    <div className="mock-grid">
      {user?.role === "FACULTY" && (
        <div className="quiz-card add-quiz-card" onClick={() => navigate("/faculty/add-quiz")}>
          <div className="add-icon">+</div>
          <h3>Create New Quiz</h3>
          <p>Add a new mock test for students</p>
        </div>
      )}
      {quizzes.length === 0 && (
        <div className="empty-state">
          No quizzes available.
>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
        </div>
      )}

    </div>
  );
}
