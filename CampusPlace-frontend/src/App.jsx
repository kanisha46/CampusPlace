import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Dashboard from "./pages/Dashboard";
import QuestionBank from "./pages/QuestionBank";
import OAuthSuccess from "./context/OAuthSuccess";
import AttemptQuiz from "./pages/AttemptQuiz";
import MockTest from "./pages/MockTest";
import axios from "axios";
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${token}`;
}

/* ================= PRIVATE ROUTE ================= */

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
};

/* ================= ROLE BASED ROUTE ================= */

const RoleRoute = ({ allowedRole, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // If wrong role, redirect properly
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default function App() {
  const location = useLocation();

  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>

        {/* ===== LANDING ===== */}
        <Route
          path="/"
          element={
            <div className="landing-page">
              <Hero />
              <Home />
            </div>
          }
        />

        {/* ===== LOGIN ===== */}
        <Route path="/login" element={<LoginPage />} />

        {/* ===== STUDENT DASHBOARD ===== */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRole="STUDENT">
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* ===== ADMIN PANEL ===== */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRole="ADMIN">
              <AdminPanel />
            </RoleRoute>
          }
        />

        {/* ===== COMPANIES ===== */}
        <Route
          path="/companies"
          element={
            <PrivateRoute>
              <Companies />
            </PrivateRoute>
          }
        />

        <Route
          path="/companies/:id"
          element={
            <PrivateRoute>
              <CompanyDetails />
            </PrivateRoute>
          }
        />

        {/* ===== QUESTIONS ===== */}
        <Route
          path="/questions"
          element={
            <PrivateRoute>
              <QuestionBank />
            </PrivateRoute>
          }
        />
        {/* ===== MOCK TEST ===== */}
        <Route
          path="/mock-test"
          element={
            <RoleRoute allowedRole="STUDENT">
              <MockTest />
            </RoleRoute>
          }
        />
        {/* ===== ATTEMPT QUIZ ===== */}
        <Route
          path="/mock-test/:quizId"
          element={
            <RoleRoute allowedRole="STUDENT">
              <AttemptQuiz />
            </RoleRoute>
          }
        />

        {/* ===== RESUME ANALYSIS ===== */}
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />

        {/* ===== OAUTH SUCCESS ===== */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}