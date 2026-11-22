
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const formatDate = (date) => {
  if (!date) return "Pending";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

const getCategoryLabel = (category) =>
  category === "Roads and Footpaths" ? "Roads & Footpaths" :
  category === "Other" ? "Other Issues" : category;

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/complaints/${id}`);

        setComplaint(response.data.complaint);
        setHistory(
          response.data.history ||
          response.data.statusHistory ||
          []
        );
        setResponses(response.data.responses || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load complaint details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="details-page">Loading complaint details...</div>;
  }

  if (error || !complaint) {
    return (
      <div className="details-page">
        <div className="details-container">
          <p className="form-error">
            {error || "Complaint not found."}
          </p>
          <Link to="/my-complaints" className="back-link">
            ← Back to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-container">
        <Link to="/my-complaints" className="back-link">
          ← Back to My Complaints
        </Link>

        <div className="details-header">
          <div>
            <span className="section-label">COMPLAINT TRACKING</span>
            <h1>Complaint Details</h1>
            <p>Complaint ID: {complaint.complaintId}</p>
          </div>

          <span
            className={`status-badge ${complaint.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {complaint.status}
          </span>
        </div>

        <section className="details-card">
          <h2>{complaint.title}</h2>

          <div className="details-info-grid">
            <div>
              <span>Category</span>
              <strong>{getCategoryLabel(complaint.category)}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{complaint.location}</strong>
            </div>

            <div>
              <span>Submitted On</span>
              <strong>{formatDate(complaint.createdAt)}</strong>
            </div>

            <div>
              <span>Current Status</span>
              <strong>{complaint.status}</strong>
            </div>
          </div>

          <div className="details-description">
            <h3>Complaint Description</h3>
            <p>{complaint.description}</p>
          </div>
        </section>

        <section className="tracking-card">
          <h2>Complaint Progress</h2>
          <p className="tracking-subtitle">
            Follow the progress of your complaint.
          </p>

          <div className="tracking-timeline">
            {history.map((item) => (
              <div
                className="timeline-item completed"
                key={item._id}
              >
                <div className="timeline-marker">✓</div>

                <div className="timeline-content">
                  <div className="timeline-title">
                    <h3>{item.status}</h3>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  <p>
                    {item.note ||
                      `Complaint status updated to ${item.status}.`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="official-response">
          <h2>Ward Office Updates</h2>

          {responses.length === 0 ? (
            <p>
              No official responses have been posted yet.
              Further updates will appear here.
            </p>
          ) : (
            responses.map((response) => (
              <div key={response._id} className="response-item">
                <p>{response.message}</p>
                <small>
                  {response.admin?.name || "Ward Administrator"}
                  {" · "}
                  {formatDate(response.createdAt)}
                </small>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default ComplaintDetails;
