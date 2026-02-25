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

// These match your SQL dump and backend ENUMS exactly
const BRANCHES = ["IT", "CE", "CHEMICAL", "CIVIL", "EC", "IC", "MECHANICAL"];
const ROUNDS = ["ROUND_1", "ROUND_2", "ROUND_3", "ROUND_4", "TECHNICAL", "APTITUDE", "HR"];
const TYPES = ["MCQ", "CODING", "TECHNICAL", "APTITUDE", "HR"];
const DIFFICULTY = ["EASY", "MEDIUM", "HARD"];

export default function QuestionBank() {
  const role = useMemo(() => getRole(), []);
  const canManage = role === "FACULTY" || role === "ADMIN";

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

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

  // Load Companies for the dropdown
  useEffect(() => {
    setLoadingCompanies(true);
    axios
      .get(`${API_BASE}/api/companies`, { headers: authHeaders() })
      .then((res) => setCompanies(res.data || []))
      .catch((e) => console.error("Companies load error:", e))
      .finally(() => setLoadingCompanies(false));
  }, []);

  // Fetch Questions with dynamic filtering
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

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    
    const rawUser = localStorage.getItem("user");
    let userId = 13; // Default to Admin ID from SQL dump
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
      alert("Question added ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add question.");
    }
  };

  const updateFilters = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const updateForm = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="qb-page">
      {/* FILTER SECTION */}
      <div className="qb-card">
        <div className="qb-header">
          <h2>View / Filter Questions</h2>
          <p>Company-wise • Branch-wise • Round-wise • Type-wise</p>
        </div>

        <div className="qb-filters">
          <div className="qb-field">
            <label>Company</label>
            <select value={filters.companyId} onChange={(e) => updateFilters("companyId", e.target.value)}>
              <option value="">All</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="qb-field">
            <label>Branch</label>
            <select value={filters.branch} onChange={(e) => updateFilters("branch", e.target.value)}>
              <option value="">All</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="qb-field">
            <label>Round</label>
            <select value={filters.roundName} onChange={(e) => updateFilters("roundName", e.target.value)}>
              <option value="">All</option>
              {ROUNDS.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
          </div>

          <div className="qb-field">
            <label>Difficulty</label>
            <select value={filters.difficulty} onChange={(e) => updateFilters("difficulty", e.target.value)}>
              <option value="">All</option>
              {DIFFICULTY.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="qb-field">
            <label>Question Type</label>
            <select value={filters.questionType} onChange={(e) => updateFilters("questionType", e.target.value)}>
              <option value="">All</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="qb-field">
            <label>Search</label>
            <input 
              value={filters.search} 
              onChange={(e) => updateFilters("search", e.target.value)} 
              placeholder="Search question..." 
            />
          </div>

          <div className="qb-actions">
            <button className="qb-btn" onClick={fetchQuestions}>Apply Filters</button>
            <button className="qb-btn qb-btn-ghost" onClick={() => {
                setFilters({ companyId: "", branch: "", roundName: "", questionType: "", difficulty: "", search: "" });
                setTimeout(fetchQuestions, 0);
            }}>Reset</button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="qb-table-wrap">
          <table className="qb-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Branch</th>
                <th>Round</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Question</th>
              </tr>
            </thead>
            <tbody>
              {loadingQuestions ? (
                <tr><td colSpan="6" className="qb-empty">Loading questions...</td></tr>
              ) : questions.length === 0 ? (
                <tr><td colSpan="6" className="qb-empty">No questions found matching the filters.</td></tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id}>
                    {/* Displays Company Name from Backend Join */}
                    <td style={{fontWeight: '700'}}>{q.companyName || "N/A"}</td>
                    <td>{q.branch}</td>
                    <td>{String(q.roundName).replace("_", " ")}</td>
                    <td>{q.questionType}</td>
                    <td>
                      <span className={`qb-pill qb-${String(q.difficulty).toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="qb-question">{q.questionText}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN ADD FORM */}
      {canManage && (
        <div className="qb-card qb-card-secondary">
          <div className="qb-header">
            <h2>Add New Question</h2>
            <p>Contribute to the CampusPlace question bank.</p>
          </div>
          <form className="qb-form" onSubmit={handleAdd}>
            <div className="qb-grid">
              <div className="qb-field">
                <label>Target Company</label>
                <select value={form.companyId} onChange={(e) => updateForm("companyId", e.target.value)} required>
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="qb-field">
                <label>Branch</label>
                <select value={form.branch} onChange={(e) => updateForm("branch", e.target.value)}>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="qb-field">
                <label>Interview Round</label>
                <select value={form.roundName} onChange={(e) => updateForm("roundName", e.target.value)}>
                  {ROUNDS.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                </select>
              </div>

              <div className="qb-field">
                <label>Question Category</label>
                <select value={form.questionType} onChange={(e) => updateForm("questionType", e.target.value)}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="qb-field">
                <label>Difficulty</label>
                <select value={form.difficulty} onChange={(e) => updateForm("difficulty", e.target.value)}>
                  {DIFFICULTY.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="qb-field">
              <label>Question Content</label>
              <textarea 
                rows="4" 
                value={form.questionText} 
                onChange={(e) => updateForm("questionText", e.target.value)} 
                placeholder="What was the specific question asked?"
                required 
              />
            </div>

            <div className="qb-field" style={{marginTop: '12px'}}>
              <label>Answer/Hints (Optional)</label>
              <textarea 
                rows="3" 
                value={form.answerText} 
                onChange={(e) => updateForm("answerText", e.target.value)} 
                placeholder="Key solution points or the correct answer..."
              />
            </div>

            <div className="qb-actions" style={{marginTop: '20px'}}>
              <button className="qb-btn" type="submit">Submit to Bank</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}