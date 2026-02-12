import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";

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
      </Routes>

      <Footer />
    </>
  );
}