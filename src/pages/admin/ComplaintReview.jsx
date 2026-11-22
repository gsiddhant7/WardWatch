
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

function ComplaintReview() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingResponse, setSavingResponse] = useState(false);

  const statusSteps = [
    "Submitted",
    "Under Review",
    "In Progress",
    "Resolved",
  ];

  const loadComplaint = async () => {
    try {
      const result = await api.get(`/complaints/admin/${id}`);
      const data = result.data.complaint;

      setComplaint(data);
      setStatus(data.status);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load complaint details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const handleStatusUpdate = async (event) => {
    const newStatus = event.target.value;

    if (newStatus === status) return;

    try {
      setSavingStatus(true);
      setError("");

      await api.patch(`/complaints/admin/${id}/status`, {
        status: newStatus,
      });

      await loadComplaint();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update complaint status."
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const handleResponseSubmit = async (event) => {
    event.preventDefault();

    if (!response.trim()) return;

    try {
      setSavingResponse(true);
      setError("");

      await api.post(`/complaints/admin/${id}/responses`, {
        message: response.trim(),
      });

      setResponse("");
      await loadComplaint();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not publish the response."
      );
    } finally {
      setSavingResponse(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p>Loading complaint details...</p>;

  if (!complaint) {
    return (
      <div className="complaint-review-page">
        <p className="form-error">{error || "Complaint not found."}</p>
        <Link to="/admin/complaints">Back to Complaints</Link>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(status);

  return (
    <div className="complaint-review-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin/complaints" className="review-back-link">
            ← Back to Complaints
          </Link>
          <h1>Complaint Review</h1>
          <p>Review complaint information and manage its progress.</p>
        </div>

        <span className="review-complaint-id">{complaint.complaintId}</span>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="complaint-review-grid">
        <div className="complaint-review-main">
          <section className="admin-panel review-details-panel">
            <div className="review-section-heading">
              <div>
                <h2>{complaint.title}</h2>
                <p>Complaint information submitted by a citizen</p>
              </div>

              <span
                className={`status-badge ${status
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {status}
              </span>
            </div>

            <div className="review-information-grid">
              <div>
                <span>Complaint ID</span>
                <strong>{complaint.complaintId}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{complaint.category}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{complaint.location}</strong>
              </div>
              <div>
                <span>Submitted Date</span>
                <strong>{formatDate(complaint.createdAt)}</strong>
              </div>
              <div>
                <span>Reported By</span>
                <strong>{complaint.citizen?.name || "Citizen"}</strong>
              </div>
              <div>
                <span>Citizen Email</span>
                <strong>{complaint.citizen?.email || "Not available"}</strong>
              </div>
              <div>
                <span>Citizen Phone</span>
                <strong>{complaint.citizen?.phone || "Not available"}</strong>
              </div>
            </div>

            <div className="review-description">
              <h3>Complaint Description</h3>
              <p>{complaint.description}</p>
            </div>

            <div className="review-attachment">
              <h3>Attached Evidence</h3>
              {complaint.images?.length > 0 ? (
                <div className="review-image-list">
                  {complaint.images.map((image, index) => (
                    <a
                      href={image}
                      target="_blank"
                      rel="noreferrer"
                      key={`${image}-${index}`}
                    >
                      <img src={image} alt={`Complaint evidence ${index + 1}`} />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="review-no-attachment">
                  No photograph attached to this complaint.
                </div>
              )}
            </div>
          </section>

          <section className="admin-panel review-history-panel">
            <div className="review-section-heading">
              <div>
                <h2>Status History</h2>
                <p>Recorded updates for this complaint</p>
              </div>
            </div>

            <div className="review-timeline">
              {complaint.statusHistory?.map((item) => (
                <div
                  className="review-timeline-item completed"
                  key={item._id}
                >
                  <div className="review-timeline-marker">✓</div>
                  <div>
                    <strong>{item.status}</strong>
                    <p>
                      {item.note || "Status updated"} ·{" "}
                      {item.updatedBy?.name || "User"}
                    </p>
                    <p>{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel review-response-panel">
            <div className="review-section-heading">
              <div>
                <h2>Official Response</h2>
                <p>Communicate an update from the ward office</p>
              </div>
            </div>

            {complaint.responses?.map((item) => (
              <div className="official-response-display" key={item._id}>
                <strong>{item.admin?.name || "Ward Administrator"}</strong>
                <p>{item.message}</p>
                <small>{formatDate(item.createdAt)}</small>
              </div>
            ))}

            <form onSubmit={handleResponseSubmit}>
              <label htmlFor="official-response">
                Write an official response
              </label>
              <textarea
                id="official-response"
                rows="5"
                placeholder="Write an update or response for the citizen..."
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
              <button
                type="submit"
                className="admin-primary-button"
                disabled={savingResponse || !response.trim()}
              >
                {savingResponse ? "Publishing..." : "Publish Response"}
              </button>
            </form>
          </section>
        </div>

        <aside className="complaint-review-sidebar">
          <section className="admin-panel review-status-panel">
            <h2>Update Complaint Status</h2>
            <p>Change the current progress of this complaint.</p>

            <label htmlFor="review-status">Current Status</label>
            <select
              id="review-status"
              value={status}
              onChange={handleStatusUpdate}
              disabled={savingStatus}
            >
              {statusSteps.map((step) => (
                <option key={step} value={step}>
                  {step}
                </option>
              ))}
            </select>

            {savingStatus && <p>Updating status...</p>}

            <div className="review-status-note">
              Status changes are saved to the database and recorded in status
              history.
            </div>
          </section>

          <section className="admin-panel review-guidelines-panel">
            <h2>Review Guidelines</h2>
            <ul>
              <li>Check the complaint details carefully.</li>
              <li>Verify the reported location.</li>
              <li>Update the status as work progresses.</li>
              <li>Provide clear official responses.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ComplaintReview;
