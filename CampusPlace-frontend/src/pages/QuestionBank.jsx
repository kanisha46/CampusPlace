import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
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
const ROUNDS = ["ROUND_1","ROUND_2","ROUND_3","ROUND_4","TECHNICAL","APTITUDE","HR"];
const TYPES = ["MCQ","CODING","TECHNICAL","APTITUDE","HR"];
const DIFFICULTY = ["EASY","MEDIUM","HARD"];

export default function QuestionBank() {

  const role = useMemo(() => getRole(), []);
  const canManage = role === "FACULTY" || role === "ADMIN";

  const [companies,setCompanies] = useState([]);
  const [questions,setQuestions] = useState([]);
  const [selectedQuestion,setSelectedQuestion] = useState(null);

  const [loadingQuestions,setLoadingQuestions] = useState(false);
  const [loadingAI,setLoadingAI] = useState(null);

  const [aiAnswers,setAiAnswers] = useState({});
  const [solved,setSolved] = useState({});

  const [filters,setFilters] = useState({
    companyId:"",
    branch:"",
    roundName:"",
    questionType:"",
    difficulty:"",
    search:"",
  });

  const [form,setForm] = useState({
    companyId:"",
    branch:"IT",
    roundName:"ROUND_1",
    questionType:"MCQ",
    difficulty:"MEDIUM",
    questionText:"",
    answerText:"",
  });

  useEffect(()=>{

    axios
      .get(`${API_BASE}/api/companies`,{headers:authHeaders()})
      .then(res=>setCompanies(res.data||[]))
      .catch(err=>console.error(err));

    fetchQuestions();

  },[]);


  const fetchQuestions = () => {

    setLoadingQuestions(true);

    const params = {};

    Object.entries(filters).forEach(([k,v])=>{
      if(v!=="" && v!=null) params[k]=v;
    });

    axios
      .get(`${API_BASE}/api/questions/filter`,{
        params,
        headers:authHeaders()
      })
      .then(res=>{
        const data=res.data||[];

        setQuestions(data);

        if(data.length>0){
          setSelectedQuestion(data[0]);
        }else{
          setSelectedQuestion(null);
        }
      })
      .catch(err=>console.error(err))
      .finally(()=>setLoadingQuestions(false));
  };


  const groupedQuestions = useMemo(()=>{

    const groups={};

    questions.forEach(q=>{
      const company=q.companyName || "Other";

      if(!groups[company]){
        groups[company]=[];
      }

      groups[company].push(q);
    });

    return groups;

  },[questions]);


  const difficultyStats = useMemo(()=>{

    const stats={EASY:0,MEDIUM:0,HARD:0};

    questions.forEach(q=>{
      const d=String(q.difficulty).toUpperCase();
      if(stats[d]!==undefined){
        stats[d]++;
      }
    });

    return stats;

  },[questions]);


  const generateAIAnswer = async(question)=>{

    try{

      setLoadingAI(question.id);

      const res=await axios.post(
        `${API_BASE}/api/ai/generate-answer`,
        {question:question.questionText},
        {headers:authHeaders()}
      );

      setAiAnswers(prev=>({
        ...prev,
        [question.id]:res.data.answer
      }));

    }catch(err){
      console.error(err);
      alert("AI generation failed");
    }finally{
      setLoadingAI(null);
    }

  };


  const toggleSolved=(id)=>{

    setSolved(prev=>({
      ...prev,
      [id]:!prev[id]
    }));

  };


  const handleAdd = async(e)=>{

    e.preventDefault();

    const rawUser=localStorage.getItem("user");
    let userId=13;

    if(rawUser){
      try{
        const u=JSON.parse(rawUser);
        if(u?.id) userId=u.id;
      }catch{}
    }

    const payload={...form,createdBy:userId};

    try{

      await axios.post(
        `${API_BASE}/api/questions/add`,
        payload,
        {headers:authHeaders()}
      );

      setForm(p=>({...p,questionText:"",answerText:""}));

      fetchQuestions();

      alert("Question added successfully");

    }catch{
      alert("Failed to add question");
    }

  };


  const updateFilters=(k,v)=>{
    setFilters(p=>({...p,[k]:v}));
  };

  const updateForm=(k,v)=>{
    setForm(p=>({...p,[k]:v}));
  };


  return (

  <div className="qb-page">

    <div className="qb-header-section">
      <h1>Question Bank</h1>
      <p>Browse through actual interview questions shared by students.</p>
    </div>


    {/* FILTERS */}

    <div className="qb-glass-filter">

      <div className="qb-filter-grid">

        <div className="qb-input-group">
          <label>Company</label>
          <select
            value={filters.companyId}
            onChange={(e)=>updateFilters("companyId",e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map(c=>(
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="qb-input-group">
          <label>Branch</label>
          <select
            value={filters.branch}
            onChange={(e)=>updateFilters("branch",e.target.value)}
          >
            <option value="">All Branches</option>
            {BRANCHES.map(b=>(
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="qb-input-group">
          <label>Round</label>
          <select
            value={filters.roundName}
            onChange={(e)=>updateFilters("roundName",e.target.value)}
          >
            <option value="">All Rounds</option>
            {ROUNDS.map(r=>(
              <option key={r} value={r}>{r.replace("_"," ")}</option>
            ))}
          </select>
        </div>
            <div className="qb-input-group">
            <label>Question Type</label>
            <select
              value={filters.questionType}
              onChange={(e) => updateFilters("questionType", e.target.value)}
            >
              <option value="">All Types</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-input-group">
          <label>Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilters("difficulty", e.target.value)}
          >
            <option value="">All Difficulty</option>
            {DIFFICULTY.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>


      <div className="qb-filter-buttons">

        <button className="qb-prime-btn" onClick={fetchQuestions}>
          Apply Filters
        </button>

        <button
          className="qb-sec-btn"
          onClick={()=>{

            const reset={
              companyId:"",
              branch:"",
              roundName:"",
              questionType:"",
              difficulty:"",
              search:""
            };

            setFilters(reset);

            setTimeout(fetchQuestions,0);

          }}
        >
          Reset
        </button>

      </div>

    </div>



    {/* MAIN LAYOUT */}

    <div className="qb-two-col-layout">


      {/* LEFT PANEL */}

      <div className="qb-question-list">


        {/* DIFFICULTY PROGRESS */}

        <div className="qb-progress-box">

          <div className="qb-progress-row">
            <span>Easy</span>
            <div className="qb-progress-bar">
            <div
              className="qb-progress-fill qb-progress-easy"
              style={{
                width: `${(difficultyStats.EASY / questions.length) * 100 || 0}%`
              }}
            />
          </div>
          </div>
          <div className="qb-progress-row">
            <span>Medium</span>
            <div className="qb-progress-bar">
              <div
                className="qb-progress-fill qb-progress-medium"
                style={{
                  width: `${(difficultyStats.MEDIUM / questions.length) * 100 || 0}%`
                }}
              />
            </div>
          </div>

          <div className="qb-progress-row">
            <span>Hard</span>
            <div className="qb-progress-bar">
              <div
                className="qb-progress-fill qb-progress-hard"
                style={{
                  width: `${(difficultyStats.HARD / questions.length) * 100 || 0}%`
                }}
              />
            </div>
          </div>

        </div>



        {Object.entries(groupedQuestions).map(([company,companyQuestions])=>(

          <div key={company}>

            <div className="qb-company-group">
              {company}
            </div>

            {companyQuestions.map(q=>(

              <div
                key={q.id}
                className={`qb-question-item 
                ${selectedQuestion?.id===q.id?"active":""}
                ${solved[q.id]?"solved":""}`}
                onClick={()=>setSelectedQuestion(q)}
              >

                <div className="qb-question-text">
                  {q.questionText}
                </div>

                <div className="qb-question-tags">
                <span>{q.branch}</span>
                <span>{String(q.roundName).replace("_"," ")}</span>
                <span>{q.questionType}</span>

                <span className={`qb-difficulty ${q.difficulty?.toLowerCase()}`}>
                  {q.difficulty}
                </span>
              </div>

              </div>

            ))}

          </div>

        ))}

      </div>



      {/* RIGHT PANEL */}

      <div className="qb-answer-panel">

        {!selectedQuestion ? (

          <div className="qb-placeholder">
            Select a question
          </div>

        ) : (

          <>

            <h2>{selectedQuestion.questionText}</h2>

<div className="qb-action-buttons">

  <button
    className="qb-ai-btn"
    onClick={()=>generateAIAnswer(selectedQuestion)}
  >
    {loadingAI===selectedQuestion.id
      ? "Generating..."
      : "Generate AI Answer"}
  </button>

  <button
    className={`qb-solved-btn ${solved[selectedQuestion.id]?"done":""}`}
    onClick={()=>toggleSolved(selectedQuestion.id)}
  >
    {solved[selectedQuestion.id]
      ? "Solved ✓"
      : "Mark as Solved"}
  </button>

</div>


            {aiAnswers[selectedQuestion.id] && (

              <div className="qb-ai-answer-full">
                <ReactMarkdown>
                  {aiAnswers[selectedQuestion.id]}
                </ReactMarkdown>
              </div>

            )}

          </>

        )}

      </div>

    </div>



    {/* ADMIN PANEL */}

    {canManage && (

      <div className="qb-admin-container">

        <h2>Add Question</h2>

        <form onSubmit={handleAdd}>

          <textarea
            rows="3"
            placeholder="Question"
            value={form.questionText}
            onChange={(e)=>updateForm("questionText",e.target.value)}
            required
          />

          <textarea
            rows="2"
            placeholder="Answer"
            value={form.answerText}
            onChange={(e)=>updateForm("answerText",e.target.value)}
          />

          <button type="submit" className="qb-prime-btn">
            Add Question
          </button>

        </form>

      </div>

    )}

  </div>

  );

}