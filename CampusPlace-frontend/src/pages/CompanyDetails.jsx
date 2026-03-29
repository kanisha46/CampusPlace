import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./CompanyDetails.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [company, setCompany] = useState(null);
  const [student, setStudent] = useState(null);
  const [studentSkills, setStudentSkills] = useState({});

  const [checkSteps, setCheckSteps] = useState([]);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editedCompany, setEditedCompany] = useState(null);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        const email = localStorage.getItem("email");

        if (!token) {
          setError("Session expired. Please login.");
          return;
        }

        // Skills
        const skillRes = await axios.get(
          "http://localhost:8082/api/student/skills",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudentSkills(skillRes.data || {});

        // Company
        const compRes = await axios.get(
          `http://localhost:8082/api/companies/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCompany(compRes.data);
        setEditedCompany(compRes.data);

        // Profile
        const profileRes = await axios.get(
          "http://localhost:8082/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: email ? { email } : {}
          }
        );

        setStudent(profileRes.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load data. Complete profile first.");
      }
    };

    fetchData();
  }, [id]);

  /* ================= ELIGIBILITY ================= */
  const checkEligibility = () => {
    if (!company || !student || !company.criteria) return;

    setEligibilityChecked(true);
    setCheckSteps([]);
    setIsEligible(false);

    const steps = [];

    // CGPA
    steps.push({
      label: `CGPA ≥ ${company.criteria.minCgpa}`,
      passed:
        parseFloat(student.currentCgpa || 0) >=
        (company.criteria.minCgpa || 0)
    });

    // Backlogs
    steps.push({
      label: "No Active Backlogs",
      passed: company.criteria.noActiveBacklogs
        ? student.hasBacklogs === "No"
        : true
    });

    // Branch
    const branches =
      company.criteria.allowedBranches?.split(",").map(b => b.trim()) || [];

    steps.push({
      label: "Branch Match",
      passed:
        branches.length === 0 ||
        branches.includes(student.specialization)
    });

    // Skills
    if (company.skillsRequired?.length > 0) {
      company.skillsRequired.forEach(skill => {
        const score =
          studentSkills[skill.name] ||
          studentSkills[skill.name.toLowerCase()] ||
          studentSkills[skill.name.toUpperCase()] ||
          0;

        steps.push({
          label: `${skill.name} (Required: ${skill.minScore})`,
          passed: score >= skill.minScore
        });
      });
    }

    // Animate
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCheckSteps(prev => [...prev, step]);
      }, index * 500);
    });

    setTimeout(() => {
      setIsEligible(steps.every(s => s.passed));
    }, steps.length * 500);
  };

  /* ================= APPLY ================= */
  const handleApply = () => {
    alert(`Applied to ${company.name}`);
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      await axios.put(
        `http://localhost:8082/api/companies/${company.id}`,
        editedCompany,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompany(editedCompany);
      setEditMode(false);
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (error)
    return <div className="loading error-msg">{error}</div>;

  if (!company || !student)
    return <div className="loading">Loading...</div>;

  const totalSteps = 3 + (company.skillsRequired?.length || 0);

  return (
    <div className="company-details-page">
      <div className="details-card">
        <div className="content-layout">

          {/* LEFT */}
          <div>
            <span className="industry-badge">
              {company.industry}
            </span>

            {editMode ? (
              <input
                className="edit-input"
                value={editedCompany.name}
                onChange={(e) =>
                  setEditedCompany({
                    ...editedCompany,
                    name: e.target.value
                  })
                }
              />
            ) : (
              <h1>{company.name}</h1>
            )}

            <p className="location-text">📍 {company.location}</p>

            {isAdmin && (
              <button
                className="edit-company-btn"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            )}

            {/* ELIGIBILITY */}
            <div className="info-group">
              <h3>Eligibility</h3>
              <ul>
                <li>CGPA: {company.criteria?.minCgpa || "-"}</li>
                <li>
                  Backlogs:{" "}
                  {company.criteria?.noActiveBacklogs
                    ? "No"
                    : "Allowed"}
                </li>
                <li>
                  Branches:{" "}
                  {company.criteria?.allowedBranches || "All"}
                </li>
              </ul>
            </div>

            {/* SKILLS */}
            <div className="info-group">
              <h3>Skill Requirements</h3>

              {company.skillsRequired?.length === 0 ? (
                <p>No skills required</p>
              ) : (
                <ul>
                  {company.skillsRequired.map((skill, i) => {
                    const score =
                      studentSkills[skill.name] || 0;

                    return (
                      <li key={i}>
                      <span>{skill.name}</span>
                      <span>{skill.minScore}</span>
                    </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-section">
            <div className="action-card">

              {!eligibilityChecked ? (
                <>
                  <h3>Check your eligibility</h3>
                  <button
                    className="check-btn"
                    onClick={checkEligibility}
                  >
                    Check Eligibility
                  </button>
                </>
              ) : (
                <>
                  <ul className="criteria-check-list">
                    {checkSteps.map((step, i) => (
                      <li
                        key={i}
                        className={step.passed ? "pass" : "fail"}
                      >
                        {step.passed ? "✔" : "✖"} {step.label}
                      </li>
                    ))}
                  </ul>

                  {checkSteps.length === totalSteps && (
                    <>
                      {isEligible ? (
                        <div className="final-status eligible">
                          ✅ Eligible
                          <button
                            className="apply-now-btn"
                            onClick={handleApply}
                          >
                            Apply Now
                          </button>
                        </div>
                      ) : (
                        <div className="final-status not-eligible">
                          ❌ Not Eligible
                          <button
                            className="check-btn"
                            onClick={() => {
                              setEligibilityChecked(false);
                              setCheckSteps([]);
                            }}
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;