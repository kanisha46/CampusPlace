import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Companies.css";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");

  const navigate = useNavigate();

  /* ================= FETCH FROM MYSQL ================= */

  useEffect(() => {
  axios
    .get("http://localhost:8082/api/companies")
    .then((res) => {
      console.log("DATA FROM BACKEND:", res.data);
      setCompanies(res.data);
    })
    .catch((err) => {
      console.error("Error fetching companies:", err);
    });
}, []);

  /* ================= FILTER ================= */

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBranch =
        branch === "All" || company.branch === branch;

      return matchesSearch && matchesBranch;
    });
  }, [companies, search, branch]);
  console.log("COMPANIES STATE:", companies);
  console.log("FILTERED:", filteredCompanies);
  return (
    <div className="companies-page">
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
            <option value="All">All Branches</option>
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

      {/* ================= COMPANIES GRID ================= */}

      <div className="companies-grid">
  {filteredCompanies.map((company) => (
    <div
      key={company.id}
      className="company-card"
      onClick={() => navigate(`/companies/${company.id}`)}
      style={{ cursor: "pointer" }}
    >
      <h3>{company.name}</h3>
      <p>{company.location}</p>
      <p className="industry">{company.industry}</p>

      <span>{company.totalOpenings} Open Positions</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(company.website, "_blankرٍجة", "_blank");
        }}
      >
        Visit Website
      </button>
    </div>
  ))}
</div>
    </div>
  );
};

export default Companies;