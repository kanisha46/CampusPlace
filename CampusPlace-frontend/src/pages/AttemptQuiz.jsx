import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AttemptQuiz.css";

export default function AttemptQuiz() {

  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(null);

  /* ================= LOAD QUIZ ================= */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get(`http://localhost:8082/quiz/student/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setQuiz(res.data);
      setTimeLeft(res.data.durationMinutes * 60);
    })
    .catch(err => {
      console.error("Error loading quiz:", err);
    });

  }, [quizId]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0 || score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, score]);

  /* ================= AUTO SUBMIT ================= */
  useEffect(() => {
    if (timeLeft === 0 && quiz && score === null) {
      handleSubmit();
    }
  }, [timeLeft]);

  /* ================= HANDLE ANSWER ================= */
  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (score !== null) return; // prevent duplicate submit

    const token = localStorage.getItem("accessToken");

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer
      })
    );

    try {
      const res = await axios.post(
        "http://localhost:8082/quiz/student/submit",
        {
          quizId: parseInt(quizId),
          answers: formattedAnswers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setScore(res.data);

    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting test");
    }
  };

  /* ================= FORMAT TIME ================= */
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!quiz) return <div className="loading">Loading Quiz...</div>;

  /* ================= SCORE SCREEN ================= */
  if (score !== null) {
    return (
      <div className="result-container">
        <h2>Test Completed 🎉</h2>
        <h3>Your Score: {score} / {quiz.questions.length}</h3>
        <button onClick={() => navigate("/mock-test")}>
          Back to Tests
        </button>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="quiz-container">

      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="timer">⏳ {formatTime()}</div>
      </div>

      <div className="questions">
        {quiz.questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <h4>Q{index + 1}. {q.question}</h4>

            {["A", "B", "C", "D"].map(option => (
              <label key={option} className="option">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  checked={answers[q.id] === option}
                  onChange={() => handleOptionChange(q.id, option)}
                />
                {q[`option${option}`]}
              </label>
            ))}

          </div>
        ))}
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={score !== null}
      >
        Submit Test
      </button>

    </div>
  );
}