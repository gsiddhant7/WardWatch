
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
    description: "Submit your complaint with details, location and an optional photo.",
  },
  {
    number: "02",
    title: "Track Progress",
    description: "Follow your complaint as the ward office reviews and processes it.",
  },
  {
    number: "03",
    title: "See the Resolution",
    description: "Stay informed when action is taken and your issue is resolved.",
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
    </div>
  );
}

export default Home;
