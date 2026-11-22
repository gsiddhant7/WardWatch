
import { NavLink, Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link to="/admin/dashboard" className="admin-brand">
        <span className="brand-icon">W</span>
        <span>WardWatch</span>
      </Link>

      <div className="admin-sidebar-label">
        ADMINISTRATION
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard">
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink to="/admin/complaints">
          <span>▤</span>
          Manage Complaints
        </NavLink>

        <NavLink to="/admin/citizens">
          <span>♙</span>
          Manage Citizens
        </NavLink>

        <NavLink to="/admin/reports">
          <span>▥</span>
          Reports & Analytics
        </NavLink>

        <NavLink to="/admin/profile">
          <span>⚙</span>
          Admin Profile
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <Link to="/admin/login" className="admin-logout">
          <span>↪</span>
          Logout
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;
