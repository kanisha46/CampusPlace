import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Github, Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";
import { useAuth } from "../context/AuthContext";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      if (isForgotPassword) {
        await axios.post("http://localhost:8082/auth/forgot-password", { email });
        setMessage("Password reset link sent! Check your email.");
        setLoading(false);
        return;
      }

      if (isSignup) {
        const res = await axios.post(
          "http://localhost:8082/auth/signup",
          { name, email, password }
        );

        setMessage(res.data.message || "Signup successful! Please check your email to verify.");
        setIsSignup(false);
        setLoading(false);
        return;
      }

      // -------- LOGIN --------
      // -------- LOGIN --------
      const res = await axios.post("http://localhost:8082/auth/login", { email, password });
      console.log("Full Backend Response:", res.data);

      const { accessToken, role: userRole, name: userName } = res.data;

      if (accessToken) {
        // 1. Store the email so the Dashboard can use it for the GET request
        localStorage.setItem("email", email);

        // 2. Use "accessToken" to match what the backend sends
        localStorage.setItem("accessToken", accessToken);

        login(accessToken, userRole, userName, email);

        if (userRole === "ADMIN") {
          navigate("/admin");
        } else if (userRole === "FACULTY") {
           navigate("/");
        } else {
          navigate("/");
        }
      }
      else {
        setMessage("Login successful, but no token was received from the server.");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Operation failed";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className={`login-box ${isSignup ? "signup-mode" : ""} ${isForgotPassword ? "forgot-mode" : ""}`}>
        <h2>CampusPlace</h2>
        <p className="subtitle">
          {isForgotPassword ? "Reset your password" : isSignup ? "Create your account" : "Welcome back"}
        </p>

        {message && (
          <div className="server-msg error">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-field">
              <label>Full Name</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label>Email</label>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div className="form-field">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          )}

          {!isSignup && !isForgotPassword && (
            <div className="forgot-link-wrapper">
              <span className="otp-link" onClick={() => { setIsForgotPassword(true); setMessage(""); }}>
                Forgot Password?
              </span>
            </div>
          )}

          {isSignup && (
            <div className="form-field">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isForgotPassword
                ? "Send Reset Link"
                : isSignup
                  ? "Create Account"
                  : "Login"}
          </button>
        </form>

        {isForgotPassword ? (
          <p className="otp-link text-center mt-4" onClick={() => { setIsForgotPassword(false); setMessage(""); }}>
            ← Back to Login
          </p>
        ) : (
          <>
            <div className="separator">
              <span>Or continue with</span>
            </div>

            <div className="social-grid">
              <button
                className="social-btn"
                type="button"
                onClick={() =>
                  window.location.href =
                  "http://localhost:8082/oauth2/authorization/google"
                }
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                Google
              </button>
              <button
                className="social-btn"
                type="button"
                onClick={() =>
                  window.location.href =
                  "http://localhost:8082/oauth2/authorization/github"
                }
              >
                <Github size={20} />
                GitHub
              </button>
            </div>
          </>
        )}

        {!isForgotPassword && (
          <p
            className="otp-link"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don’t have an account? Sign up"}
          </p>
        )}
      </div>
    </div>
  );
}