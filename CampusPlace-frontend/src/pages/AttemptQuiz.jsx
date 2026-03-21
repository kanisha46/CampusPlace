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
      // 1. First, try to fetch the quiz structure
      const quizRes = await axios.get(
        `http://localhost:8082/quiz/student/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuiz(quizRes.data);

      // 2. Then, try to fetch the result
      try {
        const resultRes = await axios.get(
          `http://localhost:8082/quiz/student/${quizId}/result`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (resultRes.data) {
          setScore(resultRes.data.score); // Set the score from the backend
          setAlreadyAttempted(true);
        }
      } catch (err) {
        // If this fails (400 Bad Request), it just means no previous attempt exists.
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

  const updatedAnswers = {
    ...answers,
    [questionId]: selectedOption
  };

  setAnswers(updatedAnswers);

  localStorage.setItem(
    `quiz-${quizId}-answers`,
    JSON.stringify(updatedAnswers)
  );
};
  const scrollToQuestion = (id) => {
  const element = document.getElementById(`question-${id}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleSubmit = async () => {

  const token = localStorage.getItem("token");

  const formattedAnswers = Object.keys(answers).map(id => ({
    questionId: parseInt(id),
    selectedAnswer: answers[id]
  }));

  const payload = {
    quizId: parseInt(quizId),
    answers: formattedAnswers
  };

  console.log("Submitting:", payload);

  try {
    const res = await axios.post(
      "http://localhost:8082/quiz/student/submit",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const finalScore = typeof res.data === 'object' ? res.data.score : res.data;
    
    setScore(finalScore);
    setAlreadyAttempted(true); // This forces the "Result Screen" to show
    localStorage.removeItem(`quiz-${quizId}-answers`);
  } catch (error) {
    console.error("Submit error:", error.response?.data);
  }
};

  if (!quiz) return <div className="quiz-loading">Loading...</div>;

  /* ================= RESULT SCREEN ================= */
  if ((alreadyAttempted || score !== null) && quiz) {
  return (
    <div className="result-wrapper">
      <div className="result-card">
        <h2>🎉 Test Completed</h2>
        <div className="score-big">
          {score} / {quiz.questions.length}
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/mock-test")}
        >
          ← Back to Tests
        </button>

        <button
          className="retake-btn"
         onClick={() => {

  localStorage.removeItem(`quiz-${quizId}-answers`);

  setScore(null);
  setAlreadyAttempted(false);
  setAnswers({});
  setTimeLeft(quiz.durationMinutes * 60);

}}
        >🔄 Retake Quiz
      </button>
      </div>
    </div>
  );
}

  /* ================= QUIZ UI ================= */
return (
  <div className="quiz-layout">

    {/* SIDEBAR */}
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

      <div className="legend">
        <span className="legend-box answered"></span> Answered
        <span className="legend-box active"></span> Current
      </div>

      <div className="question-numbers">
        {quiz.questions.map((q, index) => (
          <div
            key={q.id}
            onClick={() => scrollToQuestion(q.id)}
            className={`q-number 
              ${answers[q.id] ? "answered" : ""} 
              ${activeQuestion === q.id ? "active" : ""}`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>

    {/* MAIN AREA */}
    <div className="quiz-main">

      {/* STICKY HEADER */}
      <div className="quiz-header">
        <h2>{quiz.title}</h2>

        {timeLeft !== null && (
          <div className="timer">
            ⏱ {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </div>
        )}

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Test
        </button>
      </div>

      {/* SCROLLABLE QUESTION AREA */}
      <div className="questions-wrapper">

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
                  onChange={() => handleOptionChange(q.id, option)}
                />
                {q[`option${option}`]}
              </label>
            ))}
          </div>
        ))}

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Test
        </button>

      </div>
    </div>
  </div>
);
}