import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./CompanyDetails.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [student, setStudent] = useState(null);
  const [checkSteps, setCheckSteps] = useState([]);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedCompany, setEditedCompany] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Use accessToken to match login
      const email = localStorage.getItem("email"); // Get email for profile lookup

      // 1. Fetch Company Details
      const compRes = await axios.get(`http://localhost:8082/api/companies/${id}`);
      setCompany(compRes.data);
      setEditedCompany(compRes.data);

      // 2. Fetch Student Profile (This contains the correct CGPA)
      const profileRes = await axios.get(`http://localhost:8082/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: email } // Pass email as query param as required by your backend
      });

      // profileRes.data contains fields like currentCgpa, hasBacklogs, and specialization
      setStudent(profileRes.data);

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchData();
}, [id]);

const checkEligibility = () => {
  if (!company || !student || !company.criteria) return;

  setEligibilityChecked(true);
  setIsEligible(false);
  setCheckSteps([]);
  setProgress(0);

  const criteria = company.criteria;
  const steps = [];

  // Use student.currentCgpa instead of student.cgpa
  steps.push({
    label: "Minimum CGPA Requirement",
    passed: parseFloat(student.currentCgpa) >= criteria.minCgpa
  });

  // Use student.hasBacklogs (which is "Yes" or "No") instead of numeric count
  steps.push({
    label: "Backlog Requirement",
    passed: criteria.noActiveBacklogs ? student.hasBacklogs === "No" : true
  });

  const branches = criteria.allowedBranches?.split(",").map(b => b.trim()) || [];

  // Use student.specialization instead of student.branch
  steps.push({
    label: "Branch Eligibility",
    passed: branches.length === 0 || branches.includes(student.specialization)
  });
  steps.forEach((step, index) => {
    setTimeout(() => {
      setCheckSteps(prev => [...prev, step]);
      setProgress(((index + 1) / steps.length) * 100);
    }, index * 1000);
  });

  setTimeout(() => {
    const allPassed = steps.every(step => step.passed);
    setIsEligible(allPassed);
  }, steps.length * 1000);
};
  const handleApply = () => {
    alert(`Application submitted for ${company.name}!`);
  };

  if (!company || !student) return <div className="loading">Gathering details...</div>;

  const handleUpdate = async () => {
  try {
    await axios.put(
      `http://localhost:8082/api/companies/${company.id}`,
      editedCompany,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setCompany(editedCompany);
    setEditMode(false);
    alert("Company Updated Successfully!");

  } catch (err) {
    console.error("Update failed", err);
  }
};

  return (
    <div className="company-details-page">
      <div className="details-card">
        <div className="content-layout">
          
          {/* LEFT SIDE: Info */}
          <div className="left-section">
            <div className="header-area">
              <span className="industry-badge">{company.industry}</span>
              {editMode ? (
              <input
                className="edit-input"
                value={editedCompany.name}
                onChange={(e) =>
                  setEditedCompany({ ...editedCompany, name: e.target.value })
                }
              />
            ) : (
              <h1>{company.name}</h1>
            )}
              <p className="location-text">📍 {company.location}</p>
            </div>

            {isAdmin && (
            <button
              className="edit-company-btn"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel Edit" : "Edit Company"}
            </button>
          )}
            <div className="highlight-container">
            <div className="highlight-item">
            <span>Annual Package</span>
            <p>{company.salaryPackage || "Not Disclosed"}</p>
            </div>
            </div>

            <div className="info-grid">
              <div className="info-group">
                <h3>Roles Offered</h3>
                <p className="roles-text">{company.rolesOffered || "Software Engineer, Analyst"}</p>
              </div>
              <div className="info-group">
                <h3>Eligibility Requirements</h3>
                <ul className="criteria-list">
                <li>
                  <strong>Min CGPA:</strong> {company.criteria?.minCgpa ?? "N/A"}
                </li>

                <li>
                  <strong>Backlogs allowed:</strong>{" "}
                  {company.criteria?.noActiveBacklogs ? "No Active Backlogs" : "Allowed"}
                </li>

                <li>
                  <strong>Branches:</strong>{" "}
                  {company.criteria?.allowedBranches ?? "All Branches Eligible"}
                </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Action Engine */}
          
          <div className="right-section">
            <div className="action-card">
              <h3>Application Portal</h3>
              <p className="action-subtext">Check your profile against company requirements</p>
              
              {!eligibilityChecked ? (
  <button className="check-btn" onClick={checkEligibility}>
    Verify My Eligibility
  </button>
) : (
  <div className="result-container">

    <h4>Checking Eligibility...</h4>

    <ul className="criteria-check-list">
      {checkSteps.map((step, index) => (
        <li key={index} className={step.passed ? "pass" : "fail"}>
          {step.passed ? "✔" : "✖"} {step.label}
        </li>
      ))}
    </ul>

    {checkSteps.length === 3 && (
      <div className={`final-status ${isEligible ? "eligible" : "not-eligible"}`}>
        {isEligible ? (
          <>
            <h3>🎉 You Are Eligible!</h3>
            <button className="apply-now-btn" onClick={handleApply}>
              Apply Now
            </button>
          </>
        ) : (
          <>
            <h3>❌ You Are Not Eligible</h3>
            <button
              className="check-btn secondary"
              onClick={() => {
                setEligibilityChecked(false);
                setCheckSteps([]);
              }}
            >
              Re-check
            </button>
          </>
        )}
      </div>
    )}
  </div>
)}
            </div>
          </div>

        </div>
      </div>
    </div>
  ); 
};
export default CompanyDetails;