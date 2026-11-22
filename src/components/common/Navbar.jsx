
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">W</span>
          <span>WardWatch</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/complaints">Community Feed</NavLink>

          {user?.role === "Citizen" && (
            <NavLink to="/dashboard">Dashboard</NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <span>{user.name}</span>
              <button
                type="button"
                className="login-link"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
