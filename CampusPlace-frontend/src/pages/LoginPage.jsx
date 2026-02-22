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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Signup password validation
    if (isSignup && password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const endpoint = isSignup ? "/auth/signup" : "/auth/login";
    const payload = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      setLoading(true);

      // 🔥 Clear old tokens before login attempt
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      const res = await axios.post(
        `http://localhost:8082${endpoint}`,
        payload
      );

      // ---------------- SIGNUP ----------------
      if (isSignup) {
        setMessage(res.data.message || "Signup successful!");
        setIsSignup(false);
        setLoading(false);
        return;
      }

      // ---------------- LOGIN ----------------
      if (!res.data.token) {
        throw new Error("Invalid login response");
      }

     const { token, role: userRole, name } = res.data;

login({
  token,
  role: userRole,
  name
});

if (userRole === "ADMIN") {
  navigate("/admin");
} else if (userRole === "FACULTY") {
  navigate("/faculty");
} else {
  navigate("/dashboard");
}

    }  catch (error) {
  console.error("Login error:", error);

  setMessage(
    error.response?.data?.message || "Login failed. Please try again."
  );

  setLoading(false);
}
  };

  return (
    <div className="login-wrapper">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className={`login-box ${isSignup ? "signup-mode" : ""}`}>
        <h2>CampusPlace</h2>
        <p className="subtitle">
          {isSignup ? "Create your account" : "Welcome back"}
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
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <div className="separator">
          <span>Or continue with</span>
        </div>

        <div className="social-grid">
          <button className="social-btn" type="button">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Google
          </button>
          <button className="social-btn" type="button">
            <Github size={20} />
            GitHub
          </button>
        </div>

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
      </div>
    </div>
  );
}