import React, { useState, useMemo, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import userlogo from "../assets/userlogo.png"; // Ensure the extension is correct

/* ================= HELPER FOR GOOGLE-STYLE AVATAR ================= */
// This function generates the background color and initials dynamically
const getAvatarStyle = (name) => {
  const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#9b59b6", "#34495e"];
  const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0;
  const bgColor = colors[charCode % colors.length];

  return {
    backgroundColor: bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    width: "100%",
    height: "100%",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  };
};

const Dashboard = () => {
  /* ================= STATE ================= */

  const [activeTab, setActiveTab] = useState("Basic Details");

  const [completedSections, setCompletedSections] = useState({
    "Basic Details": false,
    "Resume": false,
    "About": false,
    "Skills": false
  });

  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [facultyDept, setFacultyDept] = useState("");
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFileName, setResumeFileName] = useState("No file chosen");
  const [resumeError, setResumeError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [resumeValid, setResumeValid] = useState(false);

  /* ================= DATA ================= */

  const menuItems = [
    { id: "Basic Details", required: true },
    { id: "Resume", required: true },
    { id: "About", required: true },
    { id: "Skills", required: true },
  ];

  const placementSuggestions = [
    "Java",
    "React",
    "Spring Boot",
    "Node.js",
    "MySQL",
    "Python",
    "Machine Learning",
    "Communication",
    "Leadership",
    "Problem Solving"
  ];

  const domains = ["Management", "Engineering", "Arts & Science", "Medicine", "Law", "Others"];

  /* ================= SKILLS ================= */

  const addSkill = (skill) => {
    const formatted = skill.trim();
    if (formatted && !skills.includes(formatted)) {
      const updated = [...skills, formatted];
      setSkills(updated);
      setSkillInput("");
      setCompletedSections(prev => ({ ...prev, Skills: true }));
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    if (updated.length === 0) {
      setCompletedSections(prev => ({ ...prev, Skills: false }));
    }
  };

  /* ================= SAVE / FETCH ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          "http://localhost:8080/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = response.data;

        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setMobile(data.mobile || "");
        setGender(data.gender || "");
        setUserType(data.userType || "");
        setCourse(data.course || "");
        setSpecialization(data.specialization || "");
        setStartYear(data.startYear || "");
        setEndYear(data.endYear || "");
        setFacultyDept(data.facultyDept || "");
        setDesignation(data.designation || "");
        setExperience(data.experience || "");
        setQualification(data.qualification || "");
        setAboutText(data.about || "");
        setSkills(data.skills || []);

        if (data.resumeFileName) {
          setResumeFileName(data.resumeFileName);
          setResumeValid(true);
        }

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "http://localhost:8080/api/profile",
        {
          firstName,
          lastName,
          mobile,
          gender,
          userType,
          course,
          specialization,
          startYear,
          endYear,
          facultyDept,
          designation,
          experience,
          qualification,
          about: aboutText,
          skills
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    }
  };

  /* ================= AUTO COMPLETION ================= */

  const completionPercent = useMemo(() => {
    const total = Object.keys(completedSections).length;
    const completed = Object.values(completedSections).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [completedSections]);

  /* ================= FORM VALIDATION ================= */

  const isFormValid = useMemo(() => {

    if (activeTab === "Basic Details") {

      if (!firstName.trim()) return false;
      if (!lastName.trim()) return false;
      if (!email.trim()) return false;
      if (!mobile.trim()) return false;
      if (!gender) return false;
      if (!userType) return false;

      if (userType === "Student") {
        if (!course) return false;

        if ((course === "BTech" || course === "MTech") && !specialization)
          return false;

        if (!startYear || !endYear) return false;
      }

      if (userType === "Faculty") {
        if (!facultyDept) return false;
        if (!designation.trim()) return false;
        if (!experience) return false;
        if (!qualification.trim()) return false;
      }
    }

    if (activeTab === "About") {
      if (!aboutText.trim()) return false;
    }

    if (activeTab === "Skills") {
      if (skills.length === 0) return false;
    }

    if (activeTab === "Resume") {
      if (!resumeValid) return false;
    }

    return true;

  }, [
    activeTab,
    firstName,
    lastName,
    email,
    mobile,
    gender,
    userType,
    course,
    specialization,
    startYear,
    endYear,
    facultyDept,
    designation,
    experience,
    qualification,
    aboutText,
    skills,
    resumeValid
  ]);

  /* ================= AUTO MARK SECTION COMPLETE ================= */

  useEffect(() => {
    setCompletedSections(prev => ({
      ...prev,
      [activeTab]: isFormValid
    }));
  }, [isFormValid, activeTab]);

  /* ================= JSX ================= */

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

{/* ================= SIDEBAR ================= */}
<aside className="sidebar">
  <div className="profile-banner">
    <div className="avatar-box">
      {firstName ? (
        <div style={getAvatarStyle(firstName)}>
          {firstName.charAt(0)}
        </div>
      ) : (
        <img src={userlogo} alt="CampusPlace User Logo" />
      )}
    </div>
  </div>

  <div className="completion-card">
    <div className="progress-text">
      <p>Complete your Profile</p>
      <span>{completionPercent}%</span>
    </div>
    <div className="progress-bar-bg">
      <div
        className="progress-bar-fill"
        style={{ width: `${completionPercent}%` }}
      ></div>
    </div>
  </div>

  <nav className="side-nav">
    {menuItems.map((item) => (
      <div
        key={item.id}
        className={`nav-item ${activeTab === item.id ? "active" : ""}`}
        onClick={() => setActiveTab(item.id)}
      >
        <span className={`status-icon ${completedSections[item.id] ? "completed" : ""}`}>
          {completedSections[item.id] ? "✓" : ""}
        </span>
        <span className="nav-text">{item.id}</span>
        {item.required && <span className="required-label">Required</span>}
      </div>
    ))}
  </nav>
</aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="main-content">

          <header className="content-header">
            <h2>{activeTab}</h2>
          </header>

          <section className="form-body">

            {/* ================= BASIC DETAILS ================= */}
            {activeTab === "Basic Details" && (
              <div className="fade-in">

                {/* PROFILE HEADER */}
                <div className="profile-edit-header">
                  <div className="large-avatar">
                    {firstName ? (
                      <div style={{ ...getAvatarStyle(firstName), fontSize: "2.5rem" }}>
                        {firstName.charAt(0)}
                      </div>
                    ) : (
                      <img src={userlogo} alt="Default User Logo" />
                    )}
                  </div>
                  <div className="name-row">
                    <div className="form-group flex-1">
                      <label className="field-label">First Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter First Name"
                      />
                    </div>

                    <div className="form-group flex-1">
                      <label className="field-label">Last Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter Last Name"
                      />
                    </div>
                  </div>
                </div>

                {/* USERNAME */}
                <div className="form-group">
                  <label className="field-label">Username *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                  />
                </div>

                {/* EMAIL */}
                <div className="form-group">
                  <label className="field-label">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                  />
                </div>

                {/* MOBILE */}
                <div className="form-group">
                  <label className="field-label">Mobile *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter Mobile Number"
                  />
                </div>

                {/* GENDER */}
                <div className="form-group">
                  <label className="field-label">Gender *</label>
                  <div className="pill-group">
                    {["Male", "Female", "More Options"].map(g => (
                      <button
                        key={g}
                        type="button"
                        className={`pill-btn ${gender === g ? "selected" : ""}`}
                        onClick={() => setGender(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ================= USER TYPE ================= */}
                <div className="form-group divider-top">
                  <label className="field-label">User Type *</label>
                  <div className="pill-group">
                    {["Student", "Faculty"].map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`pill-btn ${userType === type ? "selected" : ""}`}
                        onClick={() => setUserType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {userType === "Student" && (
                  <>
                    <div className="form-group">
                      <label className="field-label">Course *</label>
                      <select
                        className="input-field"
                        value={course}
                        onChange={(e) => {
                          setCourse(e.target.value);
                          setSpecialization(""); // reset when course changes
                        }}
                      >
                        <option value="" disabled>Select Course</option>
                        <option value="BTech">BTech</option>
                        <option value="MTech">MTech</option>
                        <option value="MCA">MCA</option>
                        <option value="BCA">BCA</option>
                      </select>
                    </div>

                    {/* Show specialization ONLY for BTech & MTech */}
                    {(course === "BTech" || course === "MTech") && (
                      <div className="form-group">
                        <label className="field-label">Course Specialization *</label>
                        <select
                          className="input-field"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                        >
                          <option value="" disabled>Select Specialization</option>
                          <option>IT</option>
                          <option>CE</option>
                          <option>EC</option>
                          <option>IC</option>
                          <option>Civil</option>
                          <option>Mechanical</option>
                          <option>Chemical</option>
                        </select>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="field-label">Course Duration *</label>
                      <div style={{ display: "flex", gap: "15px" }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Start Year"
                          value={startYear}
                          onChange={(e) => setStartYear(e.target.value)}
                        />
                        <input
                          type="number"
                          className="input-field"
                          placeholder="End Year"
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ================= FACULTY ================= */}
                {userType === "Faculty" && (
                  <>
                    <div className="form-group">
                      <label className="field-label">Department *</label>
                      <select
                        className="input-field"
                        value={facultyDept}
                        onChange={(e) => setFacultyDept(e.target.value)}
                      >
                        <option value="" disabled>Select Department</option>
                        <option>IT</option>
                        <option>CE</option>
                        <option>EC</option>
                        <option>IC</option>
                        <option>Civil</option>
                        <option>Mechanical</option>
                        <option>Chemical</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="field-label">Designation *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Assistant Professor"
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">Years of Experience *</label>
                      <input
                        type="number"
                        className="input-field"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Enter years"
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">Highest Qualification *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="PhD / MTech"
                      />
                    </div>
                  </>
                )}

              </div>
            )}

            {/* ================= RESUME ================= */}
            {activeTab === "Resume" && (
              <div className="fade-in">
                <div className="form-group">
                  <label className="field-label">
                    Upload Resume <span className="required-star">*</span>
                  </label>

                  <div
                    className={`resume-upload-box
                      ${resumeError ? "error-input" : ""}
                      ${resumeValid ? "success-input" : ""}
                    `}
                  >
                    {isUploading ? (
                      <div className="upload-loader">
                        <div className="spinner"></div>
                        <p>Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">📄</div>
                        <p className="upload-prompt">
                          Drag and drop your PDF here or
                        </p>

                        <input
                          type="file"
                          id="resume-file"
                          className="hidden-file-input"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setResumeError("");
                            setResumeValid(false);

                            if (file.type !== "application/pdf") {
                              setResumeError("Only PDF files are allowed.");
                              setResumeFileName("No file chosen");
                              return;
                            }

                            if (file.size > 5 * 1024 * 1024) {
                              setResumeError("File size must be less than 5MB.");
                              setResumeFileName("No file chosen");
                              return;
                            }

                            setIsUploading(true);

                            setTimeout(() => {
                              setIsUploading(false);
                              setResumeFileName(file.name);
                              setResumeValid(true);
                            }, 1500);
                          }}
                        />

                        <label htmlFor="resume-file" className="custom-file-label">
                          Choose File
                        </label>

                        <span className="file-status">
                          {resumeFileName}
                        </span>
                      </>
                    )}
                  </div>

                  {resumeError && (
                    <p className="error-text">{resumeError}</p>
                  )}

                  {resumeValid && (
                    <p className="success-text">
                      Resume uploaded successfully!
                    </p>
                  )}

                  <p className="helper-text-bottom">
                    Only PDF allowed (Max 5MB)
                  </p>
                </div>
              </div>
            )}

            {/* ================= ABOUT ================= */}
            {activeTab === "About" && (
              <div className="fade-in">
                <div className="form-group">
                  <label className="field-label">
                    About Me <span className="required-star">*</span>
                  </label>

                  <p className="about-helper">
                    Maximum 1000 characters can be added
                  </p>

                  <textarea
                    className={`input-field textarea-field ${aboutError ? "error-input" : ""
                      }`}
                    rows="8"
                    maxLength="1000"
                    value={aboutText}
                    onChange={(e) => {
                      setAboutText(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setAboutError("");
                      }
                    }}
                    placeholder="Introduce yourself here! Share a brief overview of who you are, your interests, and connect with fellow users, recruiters & organizers."
                  ></textarea>

                  {aboutError && <p className="error-text">{aboutError}</p>}
                </div>

                <button
                  type="button"
                  className="ai-generate-btn"
                >
                  ⚡ Generate with AI
                </button>

              </div>
            )}

            {/* ================= SKILLS ================= */}
            {activeTab === "Skills" && (
              <div className="fade-in">

                <div className="form-group">
                  <label className="suggestion-heading">Suggestions</label>

                  <div className="pill-group">
                    {placementSuggestions.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        className="suggest-pill"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Skills *</label>

                  <input
                    type="text"
                    className="input-field"
                    placeholder="List your skills here, showcasing what you excel at."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                  />
                </div>

                {skills.length > 0 && (
                  <div className="pill-group">
                    {skills.map((skill, index) => (
                      <div key={index} className="pill-btn selected">
                        {skill}
                        <span
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                          onClick={() => removeSkill(skill)}
                        >
                          ✕
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* SAVE BUTTON */}
            <footer className="form-footer">
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={!isFormValid}
              >
                ✓ Save
              </button>
            </footer>

          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;