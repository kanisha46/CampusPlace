import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([
    { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFacultyDept();
    }
  }, [user]);

  const fetchFacultyDept = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await axios.get(`http://localhost:8082/api/profile?email=${email}`);
      if (res.data && res.data.facultyDept) {
        setBranch(res.data.facultyDept);
      } else {
        // Fallback or alert
        setBranch("CS"); 
      }
    } catch (error) {
      console.error("Error fetching faculty dept:", error);
      setBranch("CS");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branch) {
      setMessage("Error: Department not identified.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        title,
        subject,
        branch,
        durationMinutes: parseInt(duration),
        questions
      };

      await axios.post("http://localhost:8082/quiz/create", payload);
      setMessage("Quiz created successfully!");
      setTimeout(() => navigate("/faculty"), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-wrapper">
      <div className="create-quiz-box">
        <h2>Create New Mock Test</h2>
        {message && <div className={`msg-banner ${message.includes("success") ? "success" : "error"}`}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>Quiz Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Java Fundamentals" />
            </div>
            <div className="input-group">
              <label>Subject</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Core Java" />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Branch (Your Department)</label>
              <input type="text" value={branch} readOnly className="readonly-input" />
            </div>
            <div className="input-group">
              <label>Duration (Mins)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
          </div>

          <div className="questions-section">
            <h3>Questions ({questions.length})</h3>
            {questions.map((q, idx) => (
              <div key={idx} className="question-card">
                <div className="card-header-row">
                  <span>Question {idx + 1}</span>
                  <button type="button" className="remove-btn" onClick={() => removeQuestion(idx)}>Remove</button>
                </div>
                <textarea 
                  value={q.question} 
                  onChange={(e) => handleQuestionChange(idx, "question", e.target.value)} 
                  required 
                  placeholder="Enter question text..."
                />
                <div className="options-grid">
                  <div className="option">
                    <label>Option A</label>
                    <input type="text" value={q.optionA} onChange={(e) => handleQuestionChange(idx, "optionA", e.target.value)} required />
                  </div>
                  <div className="option">
                    <label>Option B</label>
                    <input type="text" value={q.optionB} onChange={(e) => handleQuestionChange(idx, "optionB", e.target.value)} required />
                  </div>
                  <div className="option">
                    <label>Option C</label>
                    <input type="text" value={q.optionC} onChange={(e) => handleQuestionChange(idx, "optionC", e.target.value)} required />
                  </div>
                  <div className="option">
                    <label>Option D</label>
                    <input type="text" value={q.optionD} onChange={(e) => handleQuestionChange(idx, "optionD", e.target.value)} required />
                  </div>
                </div>
                <div className="correct-answer">
                  <label>Correct Answer</label>
                  <select value={q.correctAnswer} onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>
            ))}
            <button type="button" className="add-question-btn" onClick={addQuestion}>+ Add Another Question</button>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/mock-test")}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
