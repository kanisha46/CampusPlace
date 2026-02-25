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

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role) return String(payload.role).toUpperCase();
      if (payload?.roles?.length) return String(payload.roles[0]).toUpperCase();
      if (payload?.authorities?.length) return String(payload.authorities[0]).toUpperCase();
    } catch {}
  }

  return "STUDENT";
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BRANCHES = ["IT", "CSE", "ECE", "ME", "CE", "EEE", "AI-DS", "OTHER"];
const ROUNDS = ["ROUND_1", "ROUND_2", "ROUND_3", "HR"];
const TYPES = ["DSA", "APTITUDE", "TECHNICAL", "HR", "MCQ", "CODING"];
const DIFFICULTY = ["EASY", "MEDIUM", "HARD"];

export default function QuestionBank() {
  const role = useMemo(() => getRole(), []);
  const canManage = role === "FACULTY" || role === "ADMIN";

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [filters, setFilters] = useState({
    companyId: "",
    branch: "",
    roundName: "",
    questionType: "",
    difficulty: "",
    search: "",
  });

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [form, setForm] = useState({
    companyId: "",
    branch: "IT",
    roundName: "ROUND_1",
    questionType: "DSA",
    difficulty: "MEDIUM",
    questionText: "",
    answerText: "",
  });

  // Load companies for dropdown
  useEffect(() => {
    setLoadingCompanies(true);
    axios
      .get(`${API_BASE}/api/companies`, { headers: authHeaders() })
      .then((res) => setCompanies(res.data || []))
      .catch((e) => console.error("Companies load error:", e))
      .finally(() => setLoadingCompanies(false));
  }, []);

  const fetchQuestions = () => {
    setLoadingQuestions(true);

    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v != null) params[k] = v;
    });

    axios
      .get(`${API_BASE}/api/questions`, { params, headers: authHeaders() })
      .then((res) => setQuestions(res.data || []))
      .catch((e) => console.error("Questions load error:", e))
      .finally(() => setLoadingQuestions(false));
  };

  // initial load
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilters = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const updateForm = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.questionText.trim()) {
      alert("Please enter question text.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/questions`, form, { headers: authHeaders() });
      setForm((p) => ({ ...p, questionText: "", answerText: "" }));
      fetchQuestions();
      alert("Question added ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add question.");
    }
  };

  return (
    <div className="qb-page">
      <div className="qb-card">
        <div className="qb-header">
          <h2>View / Filter Questions</h2>
          <p>Company-wise • Branch-wise • Round-wise • Type-wise</p>
        </div>

        <div className="qb-filters">
          <div className="qb-field">
            <label>Company</label>
            <select
              value={filters.companyId}
              onChange={(e) => updateFilters("companyId", e.target.value)}
              disabled={loadingCompanies}
            >
              <option value="">All</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-field">
            <label>Branch</label>
            <select value={filters.branch} onChange={(e) => updateFilters("branch", e.target.value)}>
              <option value="">All</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-field">
            <label>Round</label>
            <select
              value={filters.roundName}
              onChange={(e) => updateFilters("roundName", e.target.value)}
            >
              <option value="">All</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-field">
            <label>Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => updateFilters("difficulty", e.target.value)}
            >
              <option value="">All</option>
              {DIFFICULTY.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-field">
            <label>Question Type</label>
            <select
              value={filters.questionType}
              onChange={(e) => updateFilters("questionType", e.target.value)}
            >
              <option value="">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
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
            <button className="qb-btn" onClick={fetchQuestions}>
              Apply Filters
            </button>
            <button
              className="qb-btn qb-btn-ghost"
              onClick={() => {
                setFilters({
                  companyId: "",
                  branch: "",
                  roundName: "",
                  questionType: "",
                  difficulty: "",
                  search: "",
                });
                setTimeout(fetchQuestions, 0);
              }}
            >
              Reset
            </button>
          </div>
        </div>

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
                <tr>
                  <td colSpan="6" className="qb-empty">
                    Loading...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="qb-empty">
                    No questions found.
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.companyName || "-"}</td>
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

      {canManage && (
        <div className="qb-card qb-card-secondary">
          <div className="qb-header">
            <h2>Add Question (Faculty/Admin)</h2>
            <p>Students will only be able to view & filter.</p>
          </div>

          <form className="qb-form" onSubmit={handleAdd}>
            <div className="qb-grid">
              <div className="qb-field">
                <label>Company</label>
                <select
                  value={form.companyId}
                  onChange={(e) => updateForm("companyId", e.target.value)}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="qb-field">
                <label>Branch</label>
                <select value={form.branch} onChange={(e) => updateForm("branch", e.target.value)}>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="qb-field">
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

              <div className="qb-field">
                <label>Type</label>
                <select
                  value={form.questionType}
                  onChange={(e) => updateForm("questionType", e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="qb-field">
                <label>Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => updateForm("difficulty", e.target.value)}
                >
                  {DIFFICULTY.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="qb-field">
              <label>Question</label>
              <textarea
                rows="4"
                value={form.questionText}
                onChange={(e) => updateForm("questionText", e.target.value)}
                placeholder="Enter question asked in round..."
                required
              />
            </div>

            <div className="qb-field">
              <label>Answer (optional)</label>
              <textarea
                rows="3"
                value={form.answerText}
                onChange={(e) => updateForm("answerText", e.target.value)}
                placeholder="Optional answer/solution notes..."
              />
            </div>

            <div className="qb-actions">
              <button className="qb-btn" type="submit">
                Add Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}