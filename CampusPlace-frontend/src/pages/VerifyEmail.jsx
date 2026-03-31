import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading"); // loading, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`https://campusplace.onrender.com/auth/verify-email?token=${token}`);
        setMessage(res.data.message || "Email verified! You can now login.");
        setStatus("success");
      } catch (error) {
        setMessage(error.response?.data?.message || "Verification failed. Link may be expired.");
        setStatus("error");
      }
    };

    verify();
  }, [params]);

  return (
    <div className="login-wrapper">
      <div className={`login-box text-center p-12`}>
        <h2 className="mb-6">Email Verification</h2>
        
        <div className={`server-msg ${status === "error" ? "error" : "success"}`} style={{ display: "block" }}>
          {message}
        </div>

        {status !== "loading" && (
          <div className="mt-8">
            <Link to="/login" className="submit-btn" style={{ textDecoration: "none", display: "inline-block" }}>
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
