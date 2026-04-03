import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Github, Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";
import { backendWarmer } from "../utils/backendWarmer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [warmingStatus, setWarmingStatus] = useState("");
  const [isWarming, setIsWarming] = useState(false);

  const navigate = useNavigate();
  const { login, backendReady } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setWarmingStatus("");

    try {
      setLoading(true);



      // 🔑 Forgot Password
      if (isForgotPassword) {
        await axios.post(`${API_BASE}/auth/forgot-password`, { email });
        setMessage("Password reset link sent!");
        setLoading(false);
        return;
      }

      // 🆕 Signup
      if (isSignup) {
        if (password !== confirmPassword) {
          setMessage("Passwords do not match");
          setLoading(false);
          return;
        }

        const res = await axios.post(`${API_BASE}/auth/signup`, {
          name,
          email,
          password,
        });

        setMessage(res.data.message || "Signup successful!");
        setIsSignup(false);
        setLoading(false);
        return;
      }

      // 🔐 Login
      setWarmingStatus("Logging in...");
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { accessToken, role, name: userName } = res.data;

      if (accessToken) {
        localStorage.setItem("email", email);
        localStorage.setItem("accessToken", accessToken);

        login(accessToken, role, userName, email);

        if (role === "ADMIN") navigate("/admin");
        else navigate("/");
      } else {
        setMessage("Login failed: No token received");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setWarmingStatus("");
      setIsWarming(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div
        className={`login-box ${isSignup ? "signup-mode" : ""} ${
          isForgotPassword ? "forgot-mode" : ""
        }`}
      >
        <h2>CampusPlace</h2>

        <p className="subtitle">
          {isForgotPassword
            ? "Reset your password"
            : isSignup
            ? "Create your account"
            : "Welcome back"}
        </p>

        {/* ❌ Error Message */}
        {message && <div className="server-msg error">{message}</div>}

        {/* 🔥 Warming Message */}
        {warmingStatus && (
          <div className="server-msg warming">
            <div className="warming-spinner"></div>
            {warmingStatus}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isForgotPassword && (
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          )}

          {isSignup && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : isForgotPassword
              ? "Send Reset Link"
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {/* 🔁 Toggle */}
        <div className="forgot-link-wrapper mt-4 text-center">
          {!isForgotPassword && (
            <p className="otp-link" onClick={() => setIsSignup(!isSignup)}>
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Signup"}
            </p>
          )}
          <p className="otp-link mb-6" onClick={() => setIsForgotPassword(!isForgotPassword)}>
            {isForgotPassword ? "Back to Login" : "Forgot Password?"}
          </p>
        </div>
      </div>
    </div>
  );
}