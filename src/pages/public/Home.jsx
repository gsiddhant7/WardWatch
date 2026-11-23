
const categories = [
  {
    icon: "🛣️",
    title: "Roads & Footpaths",
    description: "Damaged roads, potholes and unsafe footpaths.",
  },
  {
    icon: "💧",
    title: "Water Supply",
    description: "Water shortages, leakage and supply issues.",
  },
  {
    icon: "🗑️",
    title: "Waste Management",
    description: "Garbage collection and waste disposal problems.",
  },
  {
    icon: "💡",
    title: "Streetlights",
    description: "Broken or non-functioning streetlights.",
  },
  {
    icon: "🌧️",
    title: "Drainage",
    description: "Blocked drains and waterlogging problems.",
  },
  {
    icon: "📋",
    title: "Other Issues",
    description: "Report any other concern in your community.",
  },
];

const steps = [
  {
    number: "01",
    title: "Report an Issue",
    description:
      "Submit your complaint with details, location and an optional photo.",
  },
  {
    number: "02",
    title: "Track Progress",
    description:
      "Follow your complaint as the ward office reviews and processes it.",
  },
  {
    number: "03",
    title: "See the Resolution",
    description:
      "Stay informed when action is taken and your issue is resolved.",
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">YOUR WARD, YOUR VOICE</span>

          <h1>
            Together, Let's Make
            <span> Our Ward Better.</span>
          </h1>

          <p>
            Report local problems, share your concerns, and
            stay informed about the progress of your community.
          </p>

          <div className="hero-actions">
            <a href="/register" className="primary-button">
              Report an Issue
            </a>

            <a href="/complaints" className="secondary-button">
              Explore Complaints
            </a>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <span className="section-label">SIMPLE PROCESS</span>
          <h2>How WardWatch Works</h2>
          <p>
            Making communication between citizens and the ward
            office easier, clearer and more transparent.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <span className="section-label">COMMUNITY CONCERNS</span>
          <h2>What Can You Report?</h2>
          <p>
            Help improve your neighbourhood by reporting
            problems that affect everyday community life.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.title}>
              <div className="category-icon">{category.icon}</div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the Project and Acknowledgements */}
<section
  id="about-creator"
  className="acknowledgements-section"
>
  <div className="acknowledgements-container">
          <div className="acknowledgements-heading">
            <span className="section-label">BEHIND WARDWATCH</span>
            <h2>Built through learning and collaboration.</h2>
            <p>
              WardWatch is an academic project developed to explore
              how web technology can improve public grievance
              reporting and local-level service management.
            </p>
            <p>
              The project was designed and implemented by
              <strong> Siddhant Ghimire</strong>, with support from
              educational materials, technical documentation,
              online tutorials, developer communities and
              AI-assisted tools.
            </p>
          </div>

          <div className="acknowledgements-grid">
            <div className="acknowledgement-card">
              <span>📚</span>
              <h3>Books & Learning Materials</h3>
              <p>
                Academic books, study materials and learning
                resources that helped build the foundation.
              </p>
            </div>

            <div className="acknowledgement-card">
              <span>🌐</span>
              <h3>Online Resources</h3>
              <p>
                Technical documentation, tutorials and
                developer communities that supported implementation.
              </p>
            </div>

            <div className="acknowledgement-card">
              <span>🤖</span>
              <h3>AI-Assisted Learning</h3>
              <p>
                ChatGPT and other AI tools that assisted with
                learning, problem-solving and development guidance.
              </p>
            </div>
          </div>

          <div className="creator-credit">
            <div>
              <span className="creator-label">PROJECT DEVELOPER</span>
              <h3>Siddhant Ghimire</h3>
              <p>Thank you to everyone and every resource that helped make this project possible.</p>
            </div>

            <a
              href="https://siddhantghimire62.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="creator-link"
            >
              Visit my website ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
