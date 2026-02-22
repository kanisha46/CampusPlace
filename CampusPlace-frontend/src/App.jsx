import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Dashboard from "./pages/Dashboard";
import QuestionBank from "./pages/QuestionBank";

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
  return (
    <>
      <Header />

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

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <Footer />
    </>
  );
}