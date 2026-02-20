import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
// src/App.jsx
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";



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
        {/* <Route path="/companies" element={<CompaniesPage />} /> */}
      </Routes>

      <Footer />
    </>
  );
}