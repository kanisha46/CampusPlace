import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./QuestionBank.css";

const API_BASE = "http://localhost:8082";

function getRole() {
  const direct = localStorage.getItem("role");
  if (direct) return String(direct).toUpperCase();

  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      const u = JSON.parse(rawUser);
      if (u?.role) return String(u.role).toUpperCase();
    } catch {}
  }
  return "STUDENT";
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BRANCHES = ["IT", "CE", "CHEMICAL", "CIVIL", "EC", "IC", "MECHANICAL"];
const ROUNDS = ["ROUND_1", "ROUND_2", "ROUND_3", "ROUND_4", "TECHNICAL", "APTITUDE", "HR"];
const TYPES = ["MCQ", "CODING", "TECHNICAL", "APTITUDE", "HR"];
const DIFFICULTY = ["EASY", "MEDIUM", "HARD"];

export default function QuestionBank() {
  const role = useMemo(() => getRole(), []);
  const canManage = role === "FACULTY" || role === "ADMIN";

  const [companies, setCompanies] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [filters, setFilters] = useState({
    companyId: "",
    branch: "",
    roundName: "",
    questionType: "",
    difficulty: "",
    search: "",
  });

  const [form, setForm] = useState({
    companyId: "",
    branch: "IT",
    roundName: "ROUND_1",
    questionType: "MCQ",
    difficulty: "MEDIUM",
    questionText: "",
    answerText: "",
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/companies`, { headers: authHeaders() })
      .then((res) => setCompanies(res.data || []))
      .catch((e) => console.error("Companies load error:", e));
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setLoadingQuestions(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v != null) params[k] = v;
    });

    axios
      .get(`${API_BASE}/api/questions/filter`, { params, headers: authHeaders() })
      .then((res) => setQuestions(res.data || []))
      .catch((e) => console.error("Questions load error:", e))
      .finally(() => setLoadingQuestions(false));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const rawUser = localStorage.getItem("user");
    let userId = 13; 
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u?.id) userId = u.id;
      } catch {}
    }

    const payload = { ...form, createdBy: userId };

    try {
      await axios.post(`${API_BASE}/api/questions/add`, payload, { headers: authHeaders() });
      setForm((p) => ({ ...p, questionText: "", answerText: "" }));
      fetchQuestions();
      alert("Question added to bank ✅");
    } catch (err) {
      alert("Failed to add question.");
    }
  };

  const updateFilters = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const updateForm = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="qb-page">
      <div className="qb-header-section">
        <h1>Question Bank</h1>
        <p>Browse through actual interview questions shared by students.</p>
      </div>

      {/* MODERN FILTER BAR */}
      <div className="qb-glass-filter">
        <div className="qb-filter-grid">
          <div className="qb-input-group">
            <label>Company</label>
            <select value={filters.companyId} onChange={(e) => updateFilters("companyId", e.target.value)}>
              <option value="">All Companies</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="qb-input-group">
            <label>Branch</label>
            <select value={filters.branch} onChange={(e) => updateFilters("branch", e.target.value)}>
              <option value="">All Branches</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="qb-input-group">
            <label>Round</label>
            <select value={filters.roundName} onChange={(e) => updateFilters("roundName", e.target.value)}>
              <option value="">All Rounds</option>
              {ROUNDS.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
          </div>

          <div className="qb-input-group">
            <label>Search</label>
            <input 
              type="text"
              value={filters.search} 
              onChange={(e) => updateFilters("search", e.target.value)} 
              placeholder="Search keyword..." 
            />
          </div>
        </div>

        <div className="qb-filter-buttons">
          <button className="qb-prime-btn" onClick={fetchQuestions}>Apply Filters</button>
          <button className="qb-sec-btn" onClick={() => {
              setFilters({ companyId: "", branch: "", roundName: "", questionType: "", difficulty: "", search: "" });
              setTimeout(fetchQuestions, 0);
          }}>Reset</button>
        </div>
      </div>

      {/* QUESTION CARDS GRID */}
      <div className="qb-results-grid">
        {loadingQuestions ? (
          <div className="qb-loading">Updating Results...</div>
        ) : questions.length === 0 ? (
          <div className="qb-empty">No questions found matching your criteria.</div>
        ) : (
          questions.map((q, idx) => (   
            <div className="qb-question-card" key={q.id} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="qb-card-top">
                <div className="qb-company">
                <img src={`https://logo.clearbit.com/${q.companyName?.toLowerCase()}.com`} />
                <span>{q.companyName || "N/A"}</span>
              </div>
                <span className={`qb-diff-badge qb-diff-${String(q.difficulty).toLowerCase()}`}>
                  {q.difficulty}
                </span>
              </div>
              
              <div className="qb-card-body">
                <p>"{q.questionText}"</p>
              </div>

              <div className="qb-card-footer">
                <span className="qb-tag">{q.branch}</span>
                <span className="qb-tag">{String(q.roundName).replace("_", " ")}</span>
                <span className="qb-tag">{q.questionType}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADMIN SECTION */}
      {canManage && (
        <div className="qb-admin-container">
          <div className="qb-header-section">
            <h2>Add New Question</h2>
          </div>
          <form className="qb-admin-form" onSubmit={handleAdd}>
             <div className="qb-filter-grid">
                <div className="qb-input-group">
                   <label>Company</label>
                   <select value={form.companyId} onChange={(e) => updateForm("companyId", e.target.value)} required>
                      <option value="">Select Company</option>
                      {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="qb-input-group">
                   <label>Difficulty</label>
                   <select value={form.difficulty} onChange={(e) => updateForm("difficulty", e.target.value)}>
                      {DIFFICULTY.map((d) => <option key={d} value={d}>{d}</option>)}
                   </select>
                </div>
                <div className="qb-input-group">
            <label>Branch</label>
            <select
              value={form.branch}
              onChange={(e) => updateForm("branch", e.target.value)}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="qb-input-group">
            <label>Round</label>
            <select
              value={form.roundName}
              onChange={(e) => updateForm("roundName", e.target.value)}
            >
              {ROUNDS.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-input-group">
            <label>Question Type</label>
            <select
              value={form.questionType}
              onChange={(e) => updateForm("questionType", e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
             </div>
             <div className="qb-input-group full-width">
                <label>Question</label>
                <textarea 
                  rows="3" 
                  value={form.questionText} 
                  onChange={(e) => updateForm("questionText", e.target.value)} 
                  placeholder="Enter the question text here..."
                  required 
                />
             </div>
             <div className="qb-input-group full-width">
              <label>Answer</label>
              <textarea
                rows="2"
                value={form.answerText}
                onChange={(e) => updateForm("answerText", e.target.value)}
                placeholder="Enter the answer or explanation"
              />
            </div>
             <button type="submit" className="qb-prime-btn">Add to Database</button>
          </form>
        </div>
      )}
    </div>
  );
}