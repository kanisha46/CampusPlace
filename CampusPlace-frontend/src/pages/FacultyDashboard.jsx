<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./FacultyDashboard.css";

export default function FacultyDashboard() {
  const { user } = useAuth();
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
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/api/profile?email=${localStorage.getItem("email")}`);
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
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

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

      await axios.post("http://localhost:8082/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile.");
    }
  };

  if (loading) return <div className="loading-screen">Detecting Neural Patterns...</div>;

  return (
    <div className="faculty-dashboard-container">
      <div className="dashboard-grid single-column">
        
        {/* PROFILE SECTION */}
        <div className="glass-panel profile-panel">
          <div className="panel-header">
            <h2>Faculty Profile</h2>
            <p>Manage your professional identity</p>
          </div>
          
          <form onSubmit={saveProfile} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={profile.firstName} onChange={handleProfileChange} placeholder="First Name" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={profile.lastName} onChange={handleProfileChange} placeholder="Last Name" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select name="facultyDept" value={profile.facultyDept} onChange={handleProfileChange}>
                  <option value="CS">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ECE">Electronics & Comm.</option>
                  <option value="MECH">Mechanical Eng.</option>
                </select>
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input name="designation" value={profile.designation} onChange={handleProfileChange} placeholder="e.g. Asst. Professor" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Experience (Years)</label>
                <input name="experience" value={profile.experience} onChange={handleProfileChange} placeholder="e.g. 5" />
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input name="qualification" value={profile.qualification} onChange={handleProfileChange} placeholder="e.g. Ph.D" />
              </div>
            </div>

            <div className="form-group full-width">
              <label>About / Bio</label>
              <textarea name="about" value={profile.about} onChange={handleProfileChange} placeholder="Brief professional summary..." rows="4" />
            </div>

            <div className="form-footer">
              {message && <span className="status-msg">{message}</span>}
              <button type="submit" className="save-btn">Update Profile</button>
            </div>
          </form>
        </div>

=======
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"; // Reuse existing neat styling

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:8082/quiz/student/list");
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header">
        <div>
          <h1>Welcome, {user?.name || "Faculty"}!</h1>
          <p>Faculty Dashboard - Manage your tests and track students</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="card-icon">📚</div>
          <h3>Manage Mock Tests</h3>
          <p>Create and monitor technical mock tests</p>
          <button
            className="card-action-btn"
            onClick={() => navigate("/mock-test")}
          >
            View / Add Tests
          </button>
        </div>

        <div className="dash-card">
          <div className="card-icon">📈</div>
          <h3>Active Quizzes</h3>
          <p>{loading ? "Loading..." : `${quizzes.length} Total Quizzes Available`}</p>
        </div>
>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
      </div>
    </div>
  );
}
