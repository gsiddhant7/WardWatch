
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToAbout = () => {
    if (location.pathname !== "/") {
      navigate("/#about-creator");
      return;
    }

    const section = document.getElementById("about-creator");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#about-creator") {
      const timer = setTimeout(() => {
        document.getElementById("about-creator")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">W</span>
          <span>WardWatch</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/complaints">
            Community Feed
          </NavLink>

          <button
            type="button"
            className="about-nav-button"
            onClick={scrollToAbout}
          >
            About
          </button>

          {user?.role === "Citizen" && (
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
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
