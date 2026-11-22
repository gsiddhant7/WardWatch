
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/complaints", {
        ...formData,
        images: [],
      });

      if (response.data.success) {
        navigate("/my-complaints", {
          state: {
            message: `Complaint ${response.data.complaint?.complaintId || ""} submitted successfully.`,
          },
        });
      } else {
        navigate("/my-complaints");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-container">
        <div className="submit-heading">
          <span className="section-label">MAKE YOUR VOICE HEARD</span>
          <h1>Submit a Complaint</h1>
          <p>
            Provide accurate information about the issue so
            your ward office can review it.
          </p>
        </div>

        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Complaint Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Briefly describe the issue"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Complaint Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Roads and Footpaths">Roads & Footpaths</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Streetlights">Streetlights</option>
              <option value="Drainage">Drainage</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Issue Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter the area, street or nearby landmark"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <small>Please provide a location within your ward.</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Complaint Description *</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              placeholder="Explain the problem in detail..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Attach a Photo (Optional)</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              disabled
            />
            <small>
              Photo uploads will be enabled after image storage is connected.
            </small>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-notice">
            <strong>Before submitting</strong>
            <p>
              Make sure the information is accurate. Your
              complaint will initially receive the status
              "Submitted" after successful submission.
            </p>
          </div>

          <div className="submit-actions">
            <Link to="/dashboard" className="cancel-button">
              Cancel
            </Link>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitComplaint;
