
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

function MyComplaints() {
  const location = useLocation();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints/my");
      setComplaints(response.data.complaints || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleCancel = async (complaintId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this complaint?"
    );

    if (!confirmed) return;

    try {
      await api.patch(`/complaints/${complaintId}/cancel`);

      setMessage("Your complaint has been cancelled.");
      await fetchMyComplaints();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel this complaint."
      );
    }
  };

  return (
    <div className="my-complaints-page">
      <section className="my-complaints-header">
        <div>
          <span className="section-label">CITIZEN PORTAL</span>
          <h1>My Complaints</h1>
          <p>
            View and track the complaints you have submitted
            to your ward office.
          </p>
        </div>

        <Link to="/submit-complaint" className="primary-button">
          + Submit New Complaint
        </Link>
      </section>

      <section className="my-complaints-content">
        <div className="my-complaints-summary">
          <h2>Your Reports</h2>
          <span>{complaints.length} complaints</span>
        </div>

        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Loading your complaints...</p>
        ) : complaints.length === 0 ? (
          <div className="empty-complaints">
            <h3>No complaints found</h3>
            <p>You haven't submitted any complaints yet.</p>
            <Link to="/submit-complaint" className="primary-button">
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="my-complaints-list">
            {complaints.map((complaint) => (
              <article
                className="my-complaint-card"
                key={complaint._id}
              >
                <div className="my-complaint-top">
                  <span className="complaint-category">
                    {getCategoryLabel(complaint.category)}
                  </span>

                  <span
                    className={`status-badge ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {complaint.status}
                  </span>
                </div>

                <h3>{complaint.title}</h3>

                <div className="my-complaint-meta">
                  <span>ID: {complaint.complaintId}</span>
                  <span>
                    Submitted: {formatDate(complaint.createdAt)}
                  </span>
                </div>

                <div className="my-complaint-actions">
                  <Link
                    to={`/complaints/${complaint.complaintId}`}
                    className="text-link"
                  >
                    View Details →
                  </Link>

                  {complaint.status === "Submitted" && (
                    <button
                      type="button"
                      className="cancel-complaint-button"
                      onClick={() =>
                        handleCancel(complaint.complaintId)
                      }
                    >
                      Cancel Complaint
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyComplaints;
