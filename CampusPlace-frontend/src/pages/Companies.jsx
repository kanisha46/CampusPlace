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
  }
});

  /* ================= FETCH COMPANIES ================= */

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/companies")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content || [];

        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setLoading(false);
      });
  }, []);

  /* ================= ADD COMPANY ================= */

    const addCompany = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8082/api/companies",
          newCompany,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setCompanies([...companies, res.data]);

        // 🎉 Trigger success animation
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
  }
});
        }, 1500);

      } catch (error) {
        alert("Failed to add company");
      }
    };

  /* ================= DELETE COMPANY ================= */

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/api/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

//   <p style={{ color: "red" }}>
//   Current Role: {user?.role}
// </p>
  /* ================= FILTER ================= */

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
        </div>
      </div>
      {/* ===== ADMIN ACTIONS ===== */}
      {user?.role === "ADMIN" && (
        <div className="admin-actions">
          <button
            className="admin-btn add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Company
          </button>
        </div>
      )}
      {/* ===== GRID ===== */}
      <div className="companies-grid">
        {loading && <p>Loading companies...</p>}

        {!loading && filteredCompanies.length === 0 && (
          <p>No companies found.</p>
        )}

        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="company-card"
            onClick={() => navigate(`/companies/${company.id}`)}
          >
            <h3>{company.name}</h3>
            <p>{company.location}</p>
            <p className="industry">{company.industry}</p>

            <span>
              {company.totalOpenings ?? 0} Open Positions
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(company.website, "_blank");
              }}
            >
              Visit Website
            </button>

            {/* ===== ADMIN DELETE BUTTON ===== */}
            {user?.role === "ADMIN" && (
              <button
                className="admin-btn remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(company.id);
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

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