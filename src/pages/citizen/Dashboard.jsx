
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const getCategoryLabel = (category) =>
  category === "Roads and Footpaths" ? "Roads & Footpaths" :
  category === "Other" ? "Other Issues" : category;

function Dashboard() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");
        setComplaints(response.data.complaints || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const total = complaints.length;
  const underReview = complaints.filter(
    (item) => item.status === "Under Review"
  ).length;
  const inProgress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span className="section-label">CITIZEN DASHBOARD</span>
          <h1>Welcome Back, {user?.name || "Citizen"}!</h1>
          <p>
            Keep track of your complaints and stay updated
            on your community's progress.
          </p>
        </div>

        <Link to="/submit-complaint" className="primary-button">
          + Submit a Complaint
        </Link>
      </section>

      <section className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Complaints</span>
            <h2>{loading ? "—" : total}</h2>
            <span className="stat-note">All your submitted reports</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Under Review</span>
            <h2>{loading ? "—" : underReview}</h2>
            <span className="stat-note">Awaiting ward office action</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">In Progress</span>
            <h2>{loading ? "—" : inProgress}</h2>
            <span className="stat-note">Currently being addressed</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Resolved</span>
            <h2>{loading ? "—" : resolved}</h2>
            <span className="stat-note">Successfully completed</span>
          </div>
        </div>

        <div className="dashboard-section-heading">
          <div>
            <h2>Recent Complaints</h2>
            <p>Overview of your recently submitted complaints.</p>
          </div>

          <Link to="/my-complaints" className="text-link">
            View All →
          </Link>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Loading your complaints...</p>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-complaints">
            <h3>No complaints yet</h3>
            <p>Submit your first complaint to get started.</p>
            <Link to="/submit-complaint" className="primary-button">
              Submit a Complaint
            </Link>
          </div>
        ) : (
          <div className="dashboard-complaints">
            {recentComplaints.map((complaint) => (
              <div
                className="dashboard-complaint"
                key={complaint._id}
              >
                <div className="dashboard-complaint-info">
                  <span className="complaint-category">
                    {getCategoryLabel(complaint.category)}
                  </span>

                  <h3>{complaint.title}</h3>

                  <p>
                    {complaint.complaintId} · {formatDate(complaint.createdAt)}
                  </p>
                </div>

                <Link
                  to={`/complaints/${complaint.complaintId}`}
                  className={`status-badge ${complaint.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {complaint.status}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
