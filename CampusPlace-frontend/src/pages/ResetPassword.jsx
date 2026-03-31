import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // success, error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = params.get("token");
    if (!token) {
      setMessage("Invalid reset link.");
      setStatus("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8082/auth/reset-password", { token, newPassword: password });
      setMessage(res.data.message || "Password reset successfully! Redirecting to login...");
      setStatus("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed. Link may be expired.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`login-box`}>
        <h2>Reset Password</h2>
        <p className="subtitle">Enter your new password below.</p>

        {message && (
          <div className={`server-msg ${status === "error" ? "error" : "success"}`} style={{ display: "block" }}>
            {message}
          </div>
        )}

        {status !== "success" ? (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
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

            <div className="form-field">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="mt-8 text-center">
            <Link to="/login" className="otp-link">Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
