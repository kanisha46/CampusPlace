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
import FacultyDashboard from "./pages/FacultyDashboard";
import OAuthSuccess from "./context/OAuthSuccess";
import AttemptQuiz from "./pages/AttemptQuiz";
import MockTest from "./pages/MockTest";
import CreateQuiz from "./pages/CreateQuiz";
import ProgressTracking from "./pages/ProgressTracking";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import FacultyDashboard from "./pages/FacultyDashboard";
import AddQuiz from "./pages/AddQuiz";

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

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role)) {
    // If wrong role, redirect properly
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "FACULTY") {
      return <Navigate to="/faculty" replace />;
    } else {
      return <Navigate to="/" replace />;
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

        <Route path="/progress" element={<ProgressTracking />} />
        {/* ===== STUDENT DASHBOARD ===== */}
        <Route
          path="/dashboard"
          element={
<<<<<<< HEAD
            <RoleRoute allowedRoles="STUDENT">
=======
            <RoleRoute allowedRoles={["STUDENT"]}>
>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* ===== ADMIN PANEL ===== */}
        <Route
          path="/admin"
          element={
<<<<<<< HEAD
            <RoleRoute allowedRoles="ADMIN">
=======
            <RoleRoute allowedRoles={["ADMIN"]}>
>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
              <AdminPanel />
            </RoleRoute>
          }
        />

        {/* ===== FACULTY DASHBOARD ===== */}
        <Route
          path="/faculty"
          element={
<<<<<<< HEAD
            <RoleRoute allowedRoles="FACULTY">
=======
            <RoleRoute allowedRoles={["FACULTY"]}>
>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
              <FacultyDashboard />
            </RoleRoute>
          }
        />
<<<<<<< HEAD
        
=======

        {/* ===== FACULTY ADD QUIZ ===== */}
        <Route
          path="/faculty/add-quiz"
          element={
            <RoleRoute allowedRoles={["FACULTY", "ADMIN"]}>
              <AddQuiz />
            </RoleRoute>
          }
        />

>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
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
            <RoleRoute allowedRoles={["STUDENT", "FACULTY"]}>
              <MockTest />
            </RoleRoute>
          }
        />
        {/* ===== ATTEMPT QUIZ ===== */}
        <Route
          path="/mock-test/:quizId"
          element={
<<<<<<< HEAD
            <RoleRoute allowedRoles={["STUDENT", "FACULTY"]}>
=======
            <RoleRoute allowedRoles={["STUDENT"]}>
>>>>>>> e61149e25ad5a39f551d4cd11f6bb8a180d5294b
              <AttemptQuiz />
            </RoleRoute>
          }
        />

        <Route
          path="/create-quiz"
          element={
            <RoleRoute allowedRoles="FACULTY">
              <CreateQuiz />
            </RoleRoute>
          }
        />

        {/* ===== RESUME ANALYSIS ===== */}
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />

        {/* ===== OAUTH SUCCESS ===== */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* ===== EMAIL & PASSWORD FLOWS ===== */}
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}