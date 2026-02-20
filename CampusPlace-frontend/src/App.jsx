import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
// src/App.jsx
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import QuestionBank from "./pages/QuestionBank";


export default function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div className="landing-page">
              <Hero />
              <Home />
            </div>
          }
        />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2. ADD THIS ROUTE HERE */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Optional: Add a route for Companies if you have that page too */}
           <Route path="/companies" element={<Companies />} />
        {/* <Route path="/companies" element={<CompaniesPage />} /> */}
        <Route path="/companies/:id" element={<CompanyDetails />} />

            <Route path="/questions" element={<QuestionBank />} />
      </Routes>

      <Footer />
    </>
  );
}