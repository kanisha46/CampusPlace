import React, { useState } from "react";
import "./QuestionBank.css";

const sampleQuestions = [
  {
    id: 1,
    category: "DSA",
    difficulty: "Easy",
    question: "What is the time complexity of Binary Search?",
    answer: "O(log n)"
  },
  {
    id: 2,
    category: "Aptitude",
    difficulty: "Medium",
    question: "If A completes work in 5 days and B in 10 days, how long together?",
    answer: "3.33 days"
  },
  {
    id: 3,
    category: "HR",
    difficulty: "Easy",
    question: "Tell me about yourself.",
    answer: "Structure your answer: Education → Skills → Projects → Goals."
  }
];

export default function QuestionBank() {
  const [filter, setFilter] = useState("All");
  const [showAnswer, setShowAnswer] = useState(null);

  const filteredQuestions =
    filter === "All"
      ? sampleQuestions
      : sampleQuestions.filter(q => q.category === filter);

  return (
    <div className="question-page">
      <h2>Question Bank</h2>

      <div className="filter-buttons">
        {["All", "DSA", "Aptitude", "HR"].map(type => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="question-list">
        {filteredQuestions.map(q => (
          <div key={q.id} className="question-card">
            <div className="question-header">
              <span className="badge">{q.category}</span>
              <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                {q.difficulty}
              </span>
            </div>

            <h4>{q.question}</h4>

            <button
              className="view-btn"
              onClick={() =>
                setShowAnswer(showAnswer === q.id ? null : q.id)
              }
            >
              {showAnswer === q.id ? "Hide Answer" : "View Answer"}
            </button>

            {showAnswer === q.id && (
              <p className="answer">{q.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}