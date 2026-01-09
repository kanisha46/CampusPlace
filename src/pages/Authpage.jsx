import { useState } from "react";
import "./auth.css";

export default function AuthPage() {
  const [signup, setSignup] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2 className="auth-logo">CampusPlace</h2>
        <h1>{signup ? "Create Account" : "Welcome Back"}</h1>

        <form>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" placeholder="••••••••" />

          {signup && (
            <>
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </>
          )}

          <button>{signup ? "Sign Up" : "Sign In"}</button>
        </form>

        {!signup && <p className="link">Forgot password?</p>}

        <p className="switch">
          {signup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setSignup(!signup)}>
            {signup ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
