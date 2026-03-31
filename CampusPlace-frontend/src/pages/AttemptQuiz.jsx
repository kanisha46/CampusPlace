import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AttemptQuiz.css";

export default function AttemptQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const questionRefs = useRef({});

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`quiz-${quizId}-answers`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [quizId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const quizRes = await axios.get(
          `http://localhost:8082/quiz/student/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuiz(quizRes.data);

        try {
          const resultRes = await axios.get(
            `http://localhost:8082/quiz/student/${quizId}/result`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (resultRes.data) {
            setScore(resultRes.data.score);
            setAlreadyAttempted(true);
          }
        } catch (err) {
          console.log("No previous result found, starting fresh.");
          setAlreadyAttempted(false);
          setTimeLeft(quizRes.data.durationMinutes * 60);
        }
      } catch (err) {
        console.error("Critical error fetching quiz:", err);
      }
    };

    fetchData();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0 || score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft === 0 && score === null) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleOptionChange = (questionId, selectedOption) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: selectedOption,
    };

    setAnswers(updatedAnswers);
    localStorage.setItem(
      `quiz-${quizId}-answers`,
      JSON.stringify(updatedAnswers)
    );
  };

  const scrollToQuestion = (index) => {
    setActiveQuestion(index + 1);
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const formattedAnswers = Object.keys(answers).map((id) => ({
      questionId: parseInt(id),
      selectedAnswer: answers[id],
    }));

    const payload = {
      quizId: parseInt(quizId),
      answers: formattedAnswers,
    };

    try {
      const res = await axios.post(
        "http://localhost:8082/quiz/student/submit",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const finalScore = typeof res.data === "object" ? res.data.score : res.data;

      setScore(finalScore);
      setAlreadyAttempted(true);
      localStorage.removeItem(`quiz-${quizId}-answers`);
    } catch (error) {
      console.error("Submit error:", error.response?.data);
    }
  };

  if (!quiz) return <div className="quiz-loading-container"><div className="loader"></div><p>Preparing your session...</p></div>;

  if ((alreadyAttempted || score !== null) && quiz) {
    const percentage = ((score / quiz.questions.length) * 100).toFixed(0);
    return (
      <div className="result-overlay">
        <div className="result-glass-card">
          <div className="result-header">
            <span className="confetti-icon">🎊</span>
            <h2>Quiz Results</h2>
          </div>
          <div className="result-score-section">
            <div className="circular-progress" style={{ "--percentage": percentage }}>
              <div className="inner-circle">
                <span className="score-num">{score}</span>
                <span className="score-total">/ {quiz.questions.length}</span>
              </div>
            </div>
            <p className="performance-text">
              {percentage >= 80 ? "Outstanding Performance!" : percentage >= 50 ? "Good Job!" : "Keep Practicing!"}
            </p>
          </div>
          <div className="result-actions">
            <button className="btn-secondary" onClick={() => navigate("/mock-test")}>
              Exit to Dashboard
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                localStorage.removeItem(`quiz-${quizId}-answers`);
                setScore(null);
                setAlreadyAttempted(false);
                setAnswers({});
                setTimeLeft(quiz.durationMinutes * 60);
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="quiz-page-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="quiz-sidebar-nav">
        <div className="sidebar-header">
          <h3>Progress</h3>
          <div className="progress-stats">
            <span>{answeredCount} of {quiz.questions.length} answered</span>
          </div>
          <div className="neon-progress-bar">
            <div className="neon-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="question-grid">
          {quiz.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => scrollToQuestion(idx)}
              className={`grid-item ${answers[q.id] ? "answered" : ""} ${activeQuestion === idx + 1 ? "active" : ""}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
           <div className="legend-item"><span className="dot answered"></span> Answered</div>
           <div className="legend-item"><span className="dot current"></span> Current</div>
           <div className="legend-item"><span className="dot pending"></span> Pending</div>
        </div>
      </aside>

      {/* MAIN QUIZ AREA */}
      <main className="quiz-main-content">
        <header className="quiz-sticky-header">
          <div className="quiz-info">
            <h1>{quiz.title}</h1>
          </div>
          <div className={`timer-display ${timeLeft < 60 ? "timer-urgent" : ""}`}>
            <span className="icon">⏱</span>
            <span className="time">
              {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}{timeLeft % 60}
            </span>
          </div>
        </header>

        <div className="questions-container">
          {quiz.questions.map((q, idx) => (
            <section 
              key={q.id} 
              id={`question-${idx}`} 
              className={`question-block ${activeQuestion === idx + 1 ? "focused" : ""}`}
              onClick={() => setActiveQuestion(idx + 1)}
            >
              <div className="question-header">
                <span className="question-number">Question {idx + 1}</span>
                <p className="question-text">{q.question}</p>
              </div>

              <div className="options-list">
                {["A", "B", "C", "D"].map((opt) => (
                  <label 
                    key={opt} 
                    className={`option-item ${answers[q.id] === opt ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionChange(q.id, opt)}
                    />
                    <span className="opt-marker">{opt}</span>
                    <span className="opt-text">{q[`option${opt}`]}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="quiz-action-footer">
          <button className="submit-quiz-btn" onClick={handleSubmit}>
            <span className="icon">🚀</span> Final Submit
          </button>
        </div>
      </main>
    </div>
  );
}