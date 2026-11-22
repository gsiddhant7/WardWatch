
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResponse, complaintsResponse] = await Promise.all([
          api.get("/users/admin/stats"),
          api.get("/complaints/admin"),
        ]);

        setStats(statsResponse.data.stats);
        setComplaints(complaintsResponse.data.complaints || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Could not load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statistics = stats
    ? [
        {
          title: "Total Complaints",
          value: stats.totalComplaints,
          description: "All active complaints",
          icon: "▤",
          color: "blue",
        },
        {
          title: "Pending Review",
          value: stats.submitted,
          description: "Awaiting administrator review",
          icon: "◷",
          color: "orange",
        },
        {
          title: "In Progress",
          value: stats.inProgress,
          description: "Currently being addressed",
          icon: "↻",
          color: "purple",
        },
        {
          title: "Resolved",
          value: stats.resolved,
          description: "Successfully resolved",
          icon: "✓",
          color: "green",
        },
      ]
    : [];

  const categories = [
    "Roads and Footpaths",
    "Water Supply",
    "Waste Management",
    "Streetlights",
    "Drainage",
    "Other",
  ].map((name) => ({
    name,
    count: complaints.filter((item) => item.category === name).length,
  }));

  const totalByCategory = categories.reduce(
    (total, category) => total + category.count,
    0
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening in your ward.</p>
        </div>

        <Link to="/admin/complaints" className="admin-primary-button">
          Manage Complaints
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      <section className="admin-statistics">
        {statistics.map((item) => (
          <div className="admin-stat-card" key={item.title}>
            <div className={`admin-stat-icon ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="admin-stat-title">{item.title}</p>
              <h2>{item.value}</h2>
              <span>{item.description}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel recent-complaints-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Recent Complaints</h2>
              <p>Latest complaints submitted by citizens</p>
            </div>
            <Link to="/admin/complaints">View All</Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint._id}>
                    <td>
                      <strong>{complaint.title}</strong>
                      <span className="admin-complaint-id">
                        {complaint.complaintId}
                      </span>
                    </td>
                    <td>{complaint.category}</td>
                    <td>{formatDate(complaint.createdAt)}</td>
                    <td>
                      <span
                        className={`status-badge ${complaint.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="4">No complaints have been submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel category-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Complaints by Category</h2>
              <p>Distribution of reported issues</p>
            </div>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <div className="category-item" key={category.name}>
                <div className="category-item-info">
                  <span>{category.name}</span>
                  <strong>{category.count}</strong>
                </div>
                <div className="category-progress">
                  <div
                    className="category-progress-fill"
                    style={{
                      width: `${
                        totalByCategory
                          ? (category.count / totalByCategory) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
