import { useEffect, useState } from "react";
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
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // FIRST → Check if result exists
    axios.get(
      `http://localhost:8082/quiz/student/${quizId}/result`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setScore(res.data.score);
      setAlreadyAttempted(true);

      // Load quiz for total questions
      return axios.get(
        `http://localhost:8082/quiz/student/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    })
    .then(res => {
      setQuiz(res.data);
    })
    .catch(() => {
      // Not attempted → load quiz normally
      axios.get(
        `http://localhost:8082/quiz/student/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setQuiz(res.data);
        setTimeLeft(res.data.durationMinutes * 60);
      });
    });

  }, [quizId]);

  useEffect(() => {
  const handleScroll = () => {
    quiz.questions.forEach(q => {
      const element = document.getElementById(`question-${q.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveQuestion(q.id);
        }
      }
    });
  };

  const container = document.querySelector(".quiz-main");
  container?.addEventListener("scroll", handleScroll);

  return () => container?.removeEventListener("scroll", handleScroll);
}, [quiz]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0 || score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft === 0 && score === null) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer
      })
    );

      const scrollToQuestion = (id) => {
    const element = document.getElementById(`question-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
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

    } catch (err) {
      console.error(err);
    }
  };

  if (!quiz) return <div className="quiz-loading">Loading...</div>;

  /* ================= RESULT SCREEN ================= */
  if (alreadyAttempted || score !== null) {
    return (
      <div className="result-wrapper">
        <div className="result-card">
          <h2>✅ You already completed this test</h2>
          <div className="score-big">
            {score} / {quiz.questions.length}
          </div>
        <button
          className="back-btn"
          onClick={() => navigate("/mock-test")}
        >
          ← Back to Tests
        </button>
        </div>
      </div>
    );
  }

  /* ================= QUIZ UI ================= */
return (
  <div className="quiz-layout">

    {/* ============ SIDEBAR ============ */}
    <div className="quiz-sidebar">
      <h3>
        {Object.keys(answers).length} / {quiz.questions.length} Answered
      </h3>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${
              (Object.keys(answers).length / quiz.questions.length) * 100
            }%`
          }}
        />
      </div>

     <div className="question-numbers">
      {quiz.questions.map((q, index) => (
        <div
          key={q.id}
          onClick={() => scrollToQuestion(q.id)}
          className={`q-number 
          ${answers[q.id] ? "answered" : ""} 
          ${activeQuestion === q.id ? "active" : ""}
        `}
        >
          {index + 1}
        </div>
      ))}
    </div>
    </div>

    {/* ============ MAIN SECTION ============ */}
    <div className="quiz-main">

      <div className="quiz-header">
        <h2>{quiz.title}</h2>

        <div className="timer-circle">
          <svg>
            <circle cx="45" cy="45" r="45" />
            <circle
              cx="45"
              cy="45"
              r="45"
              className="progress-ring"
              style={{
                strokeDashoffset:
                  283 -
                  (283 * timeLeft) /
                    (quiz.durationMinutes * 60)
              }}
            />
          </svg>
          <span>
            {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </span>
        </div>
      </div>

      {quiz.questions.map((q, index) => (
        <div
          key={q.id}
          id={`question-${q.id}`}
          className="question-card"
        >
          <h4>
            Q{index + 1}. {q.question}
          </h4>

          {["A", "B", "C", "D"].map(option => (
            <label key={option} className="option">
              <input
                type="radio"
                name={`question-${q.id}`}
                checked={answers[q.id] === option}
                onChange={() =>
                  handleOptionChange(q.id, option)
                }
              />
              {q[`option${option}`]}
            </label>
          ))}
        </div>
      ))}

      <button
        className="submit-btn"
        onClick={handleSubmit}
      >
        Submit Test
      </button>
    </div>
  </div>
);
}