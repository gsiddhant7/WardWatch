
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function ComplaintManagement() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadComplaints = async () => {
    try {
      const response = await api.get("/complaints/admin");
      setComplaints(response.data.complaints || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);
      setError("");

      await api.patch(`/complaints/admin/${complaintId}/status`, {
        status: newStatus,
      });

      await loadComplaints();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.title.toLowerCase().includes(searchText) ||
      complaint.complaintId.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All Categories" ||
      complaint.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All Statuses" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div className="admin-complaints-page">
      <div className="admin-page-header">
        <div>
          <h1>Manage Complaints</h1>
          <p>Review and manage complaints submitted by citizens.</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="complaint-management-summary">
        <div className="management-summary-card">
          <span>Total Complaints</span>
          <h2>{complaints.length}</h2>
        </div>
        <div className="management-summary-card">
          <span>Submitted</span>
          <h2>{complaints.filter((item) => item.status === "Submitted").length}</h2>
        </div>
        <div className="management-summary-card">
          <span>In Progress</span>
          <h2>{complaints.filter((item) => item.status === "In Progress").length}</h2>
        </div>
        <div className="management-summary-card">
          <span>Resolved</span>
          <h2>{complaints.filter((item) => item.status === "Resolved").length}</h2>
        </div>
      </div>

      <div className="complaint-management-panel">
        <div className="complaint-management-heading">
          <div>
            <h2>All Complaints</h2>
            <p>Search, filter and update complaint records.</p>
          </div>
          <span className="complaint-result-count">
            {filteredComplaints.length} records found
          </span>
        </div>

        <div className="complaint-filters">
          <div className="complaint-search">
            <label htmlFor="complaint-search">Search complaints</label>
            <input
              id="complaint-search"
              type="text"
              placeholder="Search by ID or complaint title..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="complaint-filter">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option>All Categories</option>
              <option>Roads and Footpaths</option>
              <option>Water Supply</option>
              <option>Waste Management</option>
              <option>Streetlights</option>
              <option>Drainage</option>
              <option>Other</option>
            </select>
          </div>

          <div className="complaint-filter">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All Statuses</option>
              <option>Submitted</option>
              <option>Under Review</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table complaint-management-table">
            <thead>
              <tr>
                <th>Complaint Details</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>
                      <strong>{complaint.title}</strong>
                      <span className="admin-complaint-id">
                        {complaint.complaintId}
                      </span>
                    </td>
                    <td>{complaint.category}</td>
                    <td>{complaint.location}</td>
                    <td>{formatDate(complaint.createdAt)}</td>
                    <td>
                      <select
                        className="complaint-status-select"
                        value={complaint.status}
                        disabled={updatingId === complaint.complaintId}
                        onChange={(event) =>
                          updateStatus(
                            complaint.complaintId,
                            event.target.value
                          )
                        }
                        aria-label={`Update status for ${complaint.complaintId}`}
                      >
                        <option>Submitted</option>
                        <option>Under Review</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="complaint-review-button"
                        onClick={() =>
                          navigate(
                            `/admin/complaints/${complaint.complaintId}`
                          )
                        }
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="complaint-empty-state">
                    No complaints match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComplaintManagement;
