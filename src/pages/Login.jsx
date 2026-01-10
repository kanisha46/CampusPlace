import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-box">

        {/* Tabs */}
        <div className="tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
        <p className="subtitle">
          {isLogin
            ? "Enter your credentials to access your dashboard"
            : "Fill the details to create your account"}
        </p>

        <form>
          {/* Email */}
          <label>Email</label>
          <div className="input-group">
            <Mail size={18} />
            <input type="email" placeholder="you@example.com" required />
          </div>

          {/* Password */}
          <div className="password-head">
            <label>Password</label>
            {isLogin && <span className="forgot">Forgot password?</span>}
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              required
            />
            <span className="eye" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Confirm password for signup */}
          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <div className="input-group">
                <Lock size={18} />
                <input type="password" placeholder="Confirm password" required />
              </div>
            </>
          )}

          <button className="submit-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

      </div>
    </div>
  );
}
