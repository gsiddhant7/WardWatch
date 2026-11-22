
import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminProfile() {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch administrator profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/users/admin/profile");
        setAdmin(response.data.admin);
      } catch (error) {
        setProfileError(
          error.response?.data?.message ||
            "Unable to load administrator profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");

    try {
      setProfileLoading(true);

      const response = await api.patch("/users/admin/profile", {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
      });

      const updatedAdmin = response.data.admin;

      setAdmin((previous) => ({
        ...previous,
        ...updatedAdmin,
      }));

      // Keep the locally stored user information synchronized
      const storedUser = localStorage.getItem("wardwatch_user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        localStorage.setItem(
          "wardwatch_user",
          JSON.stringify({
            ...parsedUser,
            ...updatedAdmin,
          })
        );
      }

      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(
        error.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError("New password must contain at least 6 characters.");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.patch(
        "/users/admin/profile/password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }
      );

      setPasswordMessage(
        response.data.message || "Password changed successfully."
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page admin-profile-page">
        <p>Loading administrator profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-page admin-profile-page">
      <div className="admin-page-header">
        <div>
          <h1>Admin Profile</h1>
          <p>Manage your administrator account information.</p>
        </div>
      </div>

      <div className="admin-profile-grid">
        <section className="admin-profile-card">
          <h3>Personal Information</h3>
          <p>Update your account details.</p>

          <form onSubmit={handleProfileSubmit}>
            <label>Full Name</label>
            <input
              name="name"
              value={admin.name}
              onChange={handleProfileChange}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleProfileChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={admin.phone}
              onChange={handleProfileChange}
              required
            />

            <label>Account Role</label>
            <input
              value={admin.role}
              readOnly
            />

            {profileError && (
              <p role="alert" style={{ color: "red" }}>
                {profileError}
              </p>
            )}

            {profileMessage && (
              <p role="status" style={{ color: "green" }}>
                {profileMessage}
              </p>
            )}

            <button type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="admin-profile-card">
          <h3>Change Password</h3>
          <p>Keep your administrator account secure.</p>

          <form onSubmit={handlePasswordSubmit}>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />

            {passwordError && (
              <p role="alert" style={{ color: "red" }}>
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p role="status" style={{ color: "green" }}>
                {passwordMessage}
              </p>
            )}

            <button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminProfile;
