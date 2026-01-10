import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ---------------- FORM SUBMIT ---------------- */
  const onSubmit = async (data) => {
    try {
      const url = otpMode
        ? "http://localhost:5000/auth/verify-otp"
        : isLogin
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/signup";

      const res = await axios.post(url, data);
      setServerMsg(res.data.message);
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Server error");
    }
  };

  /* ---------------- OTP REQUEST ---------------- */
  const requestOtp = async (email) => {
    try {
      await axios.post("http://localhost:5000/auth/request-otp", { email });
      setOtpMode(true);
      setServerMsg("OTP sent to your email");
    } catch {
      setServerMsg("Failed to send OTP");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        {/* Tabs */}
        <div className="tabs">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        <h2>{otpMode ? "OTP Verification" : isLogin ? "Welcome back" : "Create account"}</h2>

        {serverMsg && <p className="server-msg">{serverMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
          <label>Email</label>
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email required" })}
            />
          </div>
          {errors.email && <small>{errors.email.message}</small>}

          {/* OTP MODE */}
          {otpMode && (
            <>
              <label>OTP</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", { required: "OTP required" })}
                />
              </div>
              <button className="submit-btn">Verify OTP</button>
            </>
          )}

          {/* PASSWORD MODE */}
          {!otpMode && (
            <>
              <label>Password</label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                <span className="eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.password && <small>{errors.password.message}</small>}

              {!isLogin && (
                <>
                  <label>Confirm Password</label>
                  <div className="input-group">
                    <Lock size={18} />
                    <input
                      type="password"
                      {...register("confirm", { required: "Confirm password" })}
                    />
                  </div>
                </>
              )}

              <button className="submit-btn">
                {isLogin ? "Sign In" : "Sign Up"}
              </button>

              {isLogin && (
                <p className="otp-link" onClick={() => requestOtp()}>
                  Login with OTP instead
                </p>
              )}
            </>
          )}
        </form>

        {/* SOCIAL LOGIN */}
        <div className="social-box">
          <p>OR CONTINUE WITH</p>
          <div className="social-buttons">
            <a href="http://localhost:5000/auth/google" className="google">Google</a>
            <a href="http://localhost:5000/auth/github" className="github">GitHub</a>
          </div>
        </div>

      </div>
    </div>
  );
}
