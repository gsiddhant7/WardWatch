
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-heading">
          <span className="section-label">ACCOUNT SETTINGS</span>
          <h1>My Profile</h1>
          <p>View and manage your personal information.</p>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            C
          </div>

          <div className="profile-user-info">
            <h2>Citizen User</h2>
            <p>WardWatch Citizen Account</p>
          </div>

          <span className="profile-role">Citizen</span>
        </div>

        <form className="profile-form">
          <div className="profile-form-heading">
            <h2>Personal Information</h2>
            <p>Update your contact and personal details.</p>
          </div>

          <div className="profile-fields">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                defaultValue="Citizen User"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profileEmail">Email Address</label>
              <input
                type="email"
                id="profileEmail"
                defaultValue="citizen@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePhone">Phone Number</label>
              <input
                type="tel"
                id="profilePhone"
                defaultValue="9800000000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profileAddress">Residential Address</label>
              <input
                type="text"
                id="profileAddress"
                defaultValue="Kathmandu, Nepal"
              />
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/dashboard" className="cancel-button">
              Cancel
            </Link>

            <button type="button" className="auth-submit">
              Save Changes
            </button>
          </div>
        </form>

        <div className="profile-security-card">
          <div>
            <h2>Account Security</h2>
            <p>Manage your account password.</p>
          </div>

          <button type="button" className="security-button">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
