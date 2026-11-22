
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function CommunityFeed() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");
        setComplaints(response.data.complaints || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load community complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="feed-page">
      <section className="feed-header">
        <span className="section-label">COMMUNITY TRANSPARENCY</span>
        <h1>Community Complaints</h1>
        <p>
          Explore issues reported by citizens and follow their
          progress towards resolution.
        </p>
      </section>

      <section className="feed-content">
        <div className="feed-toolbar">
          <div>
            <h2>Recent Reports</h2>
            <p>Browse the latest community concerns.</p>
          </div>

          <Link to="/submit-complaint" className="primary-button">
            + Report an Issue
          </Link>
        </div>

        {loading ? (
          <p>Loading community complaints...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : complaints.length === 0 ? (
          <p>No complaints have been submitted yet.</p>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <article
                className="complaint-card"
                key={complaint._id}
              >
                <div className="complaint-top">
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

                <p className="complaint-description">
                  {complaint.description}
                </p>

                <div className="complaint-meta">
                  <span>📍 {complaint.location}</span>
                  <span>📅 {formatDate(complaint.createdAt)}</span>
                </div>

                <div className="complaint-footer">
                  <span>{complaint.complaintId}</span>

                  <Link
                    to={`/complaints/${complaint.complaintId}`}
                    className="view-button"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CommunityFeed;
