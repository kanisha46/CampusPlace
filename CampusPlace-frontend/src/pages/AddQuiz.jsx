import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddQuiz.css";

export default function AddQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [quizData, setQuizData] = useState({
    title: "",
    subject: "",
    branch: "CSE",
    durationMinutes: 30,
    questions: [
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
      },
    ],
  });

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQs = [...quizData.questions];
    updatedQs[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQs });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "A",
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQs = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:8082/quiz/faculty/add", quizData);
      setMessage("✅ Quiz created successfully!");
      setTimeout(() => navigate("/mock-test"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-quiz-wrapper">
      <div className="add-quiz-header">
        <h1>Create New Mock Test</h1>
        <p>Define test parameters and add multiple-choice questions</p>
      </div>

      {message && <div className="result-msg">{message}</div>}

      <form className="add-quiz-form" onSubmit={handleSubmit}>
        {/* === META SECTION === */}
        <section className="form-section meta-section">
          <h2>Test Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                required
                name="title"
                value={quizData.title}
                onChange={handleQuizChange}
                placeholder="e.g. Core Java Assessment"
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                required
                name="subject"
                value={quizData.subject}
                onChange={handleQuizChange}
                placeholder="e.g. Java, Python"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Branch</label>
              <select name="branch" value={quizData.branch} onChange={handleQuizChange}>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ETC">ETC</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input
                required
                type="number"
                name="durationMinutes"
                value={quizData.durationMinutes}
                onChange={handleQuizChange}
                min="1"
              />
            </div>
          </div>
        </section>

        {/* === QUESTIONS SECTION === */}
        <section className="form-section qs-section">
          <h2>Questions ({quizData.questions.length})</h2>

          {quizData.questions.map((q, i) => (
            <div key={i} className="q-block">
              <div className="q-header">
                <h3>Question {i + 1}</h3>
                {quizData.questions.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeQuestion(i)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group full-width">
                <textarea
                  required
                  placeholder="Enter the question text here..."
                  value={q.question}
                  onChange={(e) => handleQuestionChange(i, "question", e.target.value)}
                />
              </div>

              <div className="options-grid">
                <div className="form-group">
                  <label>Option A</label>
                  <input
                    required
                    value={q.optionA}
                    onChange={(e) => handleQuestionChange(i, "optionA", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Option B</label>
                  <input
                    required
                    value={q.optionB}
                    onChange={(e) => handleQuestionChange(i, "optionB", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Option C</label>
                  <input
                    required
                    value={q.optionC}
                    onChange={(e) => handleQuestionChange(i, "optionC", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Option D</label>
                  <input
                    required
                    value={q.optionD}
                    onChange={(e) => handleQuestionChange(i, "optionD", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group answer-group">
                <label>Correct Answer:</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(i, "correctAnswer", e.target.value)}
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
            </div>
          ))}

          <button type="button" className="add-q-btn" onClick={addQuestion}>
            ➕ Add Another Question
          </button>
        </section>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/mock-test")}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Mock Test"}
          </button>
        </div>
      </form>
    </div>
  );
}
