import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./FacultyDashboard.css";

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    facultyDept: "CS",
    designation: "",
    experience: "",
    qualification: "",
    about: ""
  });

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchProfile();
    fetchQuizCount();
  }, [user]);

  // ✅ FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `https://campusplace.onrender.com/api/profile?email=${localStorage.getItem("email")}`
      );

      if (res.data) {
        setProfile({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          facultyDept: res.data.facultyDept || "CS",
          designation: res.data.designation || "",
          experience: res.data.experience || "",
          qualification: res.data.qualification || "",
          about: res.data.about || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // ✅ FETCH QUIZ COUNT (for stats)
  const fetchQuizCount = async () => {
    try {
      const res = await axios.get(
        "https://campusplace.onrender.com/quiz/student/list"
      );
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE INPUT
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SAVE PROFILE
  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("Saving...");

    try {
      const profileData = {
        ...profile,
        userType: "FACULTY"
      };

      const formData = new FormData();
      formData.append("profile", JSON.stringify(profileData));

      await axios.post(
        "https://campusplace.onrender.com/api/profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile.");
    }
  };

  if (loading)
    return <div className="loading-screen">Loading...</div>;

  return (
    <div className="faculty-dashboard-container">

      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>Welcome, {user?.name || "Faculty"} 👋</h1>
          <p>Manage your profile and mock tests</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">

        {/* PROFILE */}
        <div className="glass-panel profile-panel">
          <div className="panel-header">
            <h2>Faculty Profile</h2>
          </div>

          <form onSubmit={saveProfile} className="profile-form">

            <div className="form-row">
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                placeholder="First Name"
              />
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                placeholder="Last Name"
              />
            </div>

            <div className="form-row">
              <select
                name="facultyDept"
                value={profile.facultyDept}
                onChange={handleProfileChange}
              >
                <option value="CS">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">ECE</option>
                <option value="MECH">Mechanical</option>
              </select>

              <input
                name="designation"
                value={profile.designation}
                onChange={handleProfileChange}
                placeholder="Designation"
              />
            </div>

            <div className="form-row">
              <input
                name="experience"
                value={profile.experience}
                onChange={handleProfileChange}
                placeholder="Experience"
              />
              <input
                name="qualification"
                value={profile.qualification}
                onChange={handleProfileChange}
                placeholder="Qualification"
              />
            </div>

            <textarea
              name="about"
              value={profile.about}
              onChange={handleProfileChange}
              placeholder="About..."
            />

            <div className="form-footer">
              {message && <span>{message}</span>}
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>

          </form>
        </div>

        {/* ACTION CARDS */}
        <div className="dash-grid">

          <div className="dash-card">
            <h3>📚 Manage Mock Tests</h3>
            <p>Create, edit and monitor quizzes</p>
            <button onClick={() => navigate("/mock-test")}>
              Open Mock Tests
            </button>
          </div>

          <div className="dash-card">
            <h3>📊 Total Quizzes</h3>
            <p>
              {loading
                ? "Loading..."
                : `${quizzes.length} quizzes available`}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}