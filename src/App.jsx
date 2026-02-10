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
        <Route
          path="/"
          element={
            <div className="landing-page">
              <Hero />
              <div id="dashboard-section" className="section-padding">
                <Home />
              </div>
            </div>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>

      <Footer />
    </>
  );
}