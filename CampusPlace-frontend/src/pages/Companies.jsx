import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Companies.css";

const Companies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [newCompany, setNewCompany] = useState({
  name: "",
  industry: "",
  location: "",
  branch: "",
  website: "",
  salaryPackage: "",
  driveDate: "",
  roles: "",
  description: "",
  totalOpenings: 0,
  criteria: {
    minCgpa: 0,
    noActiveBacklogs: false,
    allowedBranches: ""
  },
  skillsRequired: [],   // 🔥 NEW
  tempSkill: "",
  tempScore: ""
  });
  /* ================= FETCH COMPANIES ================= */

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
        
        const res = await axios.get(
          "http://localhost:8082/api/companies",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content || [];

        setCompanies(data);

      } catch (err) {
        console.error("Error fetching companies:", err);
        if (err.response) {
          console.error("Backend Error Data:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);
  /* ================= ADD COMPANY ================= */

const addCompany = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.post(
      "http://localhost:8082/api/companies",
      newCompany,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setCompanies([...companies, res.data]);

    setSuccess(true);

    setTimeout(() => {
      setShowModal(false);
      setSuccess(false);

      setNewCompany({
        name: "",
        industry: "",
        location: "",
        branch: "",
        website: "",
        salaryPackage: "",
        driveDate: "",
        roles: "",
        description: "",
        totalOpenings: 0,
        criteria: {
          minCgpa: 0,
          noActiveBacklogs: false,
          allowedBranches: ""
        },
        skillsRequired: [],   // 🔥 IMPORTANT
        tempSkill: "",
        tempScore: ""
      });

    }, 1500);

  } catch (error) {
    console.error("Add company error:", error);
    alert("Failed to add company");
  }
};

/* 1. First, define the general filter (Search + Branch) */
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesBranch =
        branch === "ALL" || company.branch === branch;

      return matchesSearch && matchesBranch;
    });
  }, [companies, search, branch]);

  /* 2. Second, define upcoming drives based on the filter above */
  const upcomingCompanies = useMemo(() => {
    const today = new Date();

    return filteredCompanies // This must exist above this line!
      .filter((c) => {
        if (!c.driveDate) return false;
        return new Date(c.driveDate) > today;
      })
      .sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate));
  }, [filteredCompanies]);

  /* ================= DELETE COMPANY ================= */

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");

    await axios.delete(
      `http://localhost:8082/api/companies/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setCompanies(companies.filter((c) => c.id !== id));

  } catch (err) {
    console.error("Delete failed", err);
  }
};

//   <p style={{ color: "red" }}>
//   Current Role: {user?.role}
// </p>
  /* ================= FILTER ================= */

  /* ================= RENDER ================= */

  return (
    <div className="companies-page">

      {/* DEBUG */}
      {/* <p style={{color:"red"}}>Role: {user?.role}</p> */}

      {/* ===== HEADER ===== */}
      <div className="companies-header">
        <h1>Explore Top Companies</h1>

<div className="filter-bar">

  <input
    type="text"
    placeholder="Search companies..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={branch}
    onChange={(e) => setBranch(e.target.value)}
  >
    <option value="ALL">All Branches</option>
    <option value="IT">IT</option>
    <option value="CE">CE</option>
    <option value="EC">EC</option>
    <option value="IC">IC</option>
    <option value="CHEMICAL">CHEMICAL</option>
    <option value="MECHANICAL">MECHANICAL</option>
    <option value="CIVIL">CIVIL</option>
  </select>

  <button
  className={`upcoming-btn ${showUpcoming ? "active" : ""}`}
  onClick={() => setShowUpcoming(!showUpcoming)}
>
  {showUpcoming ? "← Show All Companies" : "🚀 Upcoming Drives"}
</button>

</div>
      </div>
      {/* ===== UPCOMING DRIVES ===== */}

{showUpcoming && upcomingCompanies.length > 0 && (
  <div className="upcoming-section">
    <div className="section-title">
      <h2>🚀 Upcoming Placement Drives</h2>
      <p>Don't miss out on these opportunities. Mark your calendars!</p>
    </div>

    <div className="upcoming-grid">
      {upcomingCompanies.map((company) => {
        const driveDate = new Date(company.driveDate);
        const today = new Date();
        const diffTime = Math.abs(driveDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return (
          <div key={company.id} className="upcoming-card">
            <div className="card-badge">
              {diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : `In ${diffDays} Days`}
            </div>
            
            <div className="card-main">
              <h3>{company.name}</h3>
              <p className="upcoming-location">📍 {company.location}</p>
              <div className="upcoming-tags">
                <span className="tag industry-tag">{company.industry}</span>
                {company.salaryPackage && <span className="tag salary-tag">💰 {company.salaryPackage}</span>}
              </div>
            </div>

            <div className="card-info">
              <div className="info-item">
                <span className="label">Role</span>
                <span className="value">{company.roles || "Multiple Roles"}</span>
              </div>
              <div className="info-item">
                <span className="label">Date</span>
                <span className="value">{driveDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <button
              className="view-details-btn"
              onClick={() => navigate(`/companies/${company.id}`)}
            >
              View Details →
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}
      {/* ===== ADMIN ACTIONS ===== */}
      {user?.role === "ADMIN" && (
        <div className="admin-actions">
          <button
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            <span>+</span> Add New Company
          </button>
        </div>
      )}

      {/* ===== GRID ===== */}
      {!showUpcoming && (
        <div className="companies-grid">
          {loading && <p className="loading-state">Loading companies...</p>}

          {!loading && (showUpcoming ? upcomingCompanies : filteredCompanies).length === 0 && (
            <div className="empty-state">
              <p>No companies found matching your criteria.</p>
            </div>
          )}

          {!loading &&
            (showUpcoming ? upcomingCompanies : filteredCompanies).map((company) => (
              <div
                key={company.id}
                className="company-card"
                onClick={() => navigate(`/companies/${company.id}`)}
              >
                <h3>{company.name}</h3>
                <p>📍 {company.location}</p>
                <p className="industry">{company.industry}</p>

                <span>{company.totalOpenings ?? 0} Open Positions</span>

                <div className="card-actions">
                  <button
                    className="visit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(company.website, "_blank");
                    }}
                  >
                    Visit Website
                  </button>

                  {user?.role === "ADMIN" && (
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to remove ${company.name}?`)) {
                          handleDelete(company.id);
                        }
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            {!success ? (
              <>
                <h2>Add Company</h2>

                <div className="modal-form">

  <input
    type="text"
    placeholder="Company Name"
    value={newCompany.name}
    onChange={(e) =>
      setNewCompany({ ...newCompany, name: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Industry"
    value={newCompany.industry}
    onChange={(e) =>
      setNewCompany({ ...newCompany, industry: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Location"
    value={newCompany.location}
    onChange={(e) =>
      setNewCompany({ ...newCompany, location: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Branch (IT/CE/etc)"
    value={newCompany.branch}
    onChange={(e) =>
      setNewCompany({ ...newCompany, branch: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Website URL"
    value={newCompany.website}
    onChange={(e) =>
      setNewCompany({ ...newCompany, website: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Salary Package"
    value={newCompany.salaryPackage}
    onChange={(e) =>
      setNewCompany({ ...newCompany, salaryPackage: e.target.value })
    }
  />

  <input
    type="date"
    value={newCompany.driveDate}
    onChange={(e) =>
      setNewCompany({ ...newCompany, driveDate: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Roles (Software Engineer, Analyst)"
    value={newCompany.roles}
    onChange={(e) =>
      setNewCompany({ ...newCompany, roles: e.target.value })
    }
  />

  <textarea
    placeholder="Company Description"
    value={newCompany.description}
    onChange={(e) =>
      setNewCompany({ ...newCompany, description: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Total Openings"
    value={newCompany.totalOpenings}
    onChange={(e) =>
      setNewCompany({
        ...newCompany,
        totalOpenings: parseInt(e.target.value)
      })
    }
  />

  <h4>Eligibility Criteria</h4>

  <input
    type="number"
    step="0.1"
    placeholder="Minimum CGPA"
    value={newCompany.criteria.minCgpa}
    onChange={(e) =>
      setNewCompany({
        ...newCompany,
        criteria: {
          ...newCompany.criteria,
          minCgpa: parseFloat(e.target.value)
        }
      })
    }
  />

  <select
    value={newCompany.criteria.noActiveBacklogs}
    onChange={(e) =>
      setNewCompany({
        ...newCompany,
        criteria: {
          ...newCompany.criteria,
          noActiveBacklogs: e.target.value === "true"
        }
      })
    }
  >
    <option value="false">Backlogs Allowed</option>
    <option value="true">No Active Backlogs</option>
  </select>

  <input
    type="text"
    placeholder="Allowed Branches (CSE,IT,CE)"
    value={newCompany.criteria.allowedBranches}
    onChange={(e) =>
      setNewCompany({
        ...newCompany,
        criteria: {
          ...newCompany.criteria,
          allowedBranches: e.target.value
        }
      })
    }
  />

</div>
<h4>Skill Requirements</h4>

<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
  <input
    type="text"
    placeholder="Skill (Java, DSA)"
    value={newCompany.tempSkill}
    onChange={(e) =>
      setNewCompany({ ...newCompany, tempSkill: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Min Score (/10)"
    value={newCompany.tempScore}
    onChange={(e) =>
      setNewCompany({ ...newCompany, tempScore: e.target.value })
    }
  />

  <button
    onClick={() => {
      if (!newCompany.tempSkill || !newCompany.tempScore) return;

      setNewCompany({
        ...newCompany,
        skillsRequired: [
          ...newCompany.skillsRequired,
          {
            name: newCompany.tempSkill,
            minScore: parseFloat(newCompany.tempScore)
          }
        ],
        tempSkill: "",
        tempScore: ""
      });
    }}
  >
    Add
  </button>
</div>
<ul>
  {newCompany.skillsRequired.map((s, i) => (
    <li key={i}>
      {s.name} ({s.minScore}/10)
      <button
        onClick={() =>
          setNewCompany({
            ...newCompany,
            skillsRequired: newCompany.skillsRequired.filter((_, index) => index !== i)
          })
        }
      >
        ❌
      </button>
    </li>
  ))}
</ul>
                <div className="modal-actions">
                  <button className="save-btn" onClick={addCompany}>
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="success-container">
                <div className="checkmark-circle">
                  <div className="checkmark"></div>
                </div>
                <h3>Company Added Successfully!</h3>
              </div>
            )}

          </div>
        </div>
      )}

    </div>

    
  );
};

export default Companies;