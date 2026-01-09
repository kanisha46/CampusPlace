import { useState } from "react";
import "../styles/auth.css";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-logo">CampusPlace</h2>

        <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>

        <form>
          <label>Email Address</label>
          <input type="email" placeholder="Enter email" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          {isSignup && (
            <>
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm password" />
            </>
          )}

          <button type="submit">
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        {!isSignup && (
          <p className="link">Forgot password?</p>
        )}

        <p className="switch">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
