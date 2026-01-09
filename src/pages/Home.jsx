import "./Home.css";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h2>Your Campus Placement Partner</h2>
        <p>
          One platform for placements, preparation, resume analysis,
          and AI-powered practice.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-grid">

          <div className="feature-card">
            <h3>🎓 Student Dashboard</h3>
            <p>Track your profile, applications, and placement progress.</p>
          </div>

          <div className="feature-card">
            <h3>🏢 Company & Placements</h3>
            <p>Explore companies, roles, and placement opportunities.</p>
          </div>

          <div className="feature-card">
            <h3>📚 Question Bank</h3>
            <p>Practice interview and aptitude questions anytime.</p>
          </div>

          <div className="feature-card">
            <h3>🤖 AI Question Generator</h3>
            <p>Generate smart questions based on your skills.</p>
          </div>

          <div className="feature-card">
            <h3>📄 Resume Analysis</h3>
            <p>Get AI-powered feedback on your resume.</p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;
