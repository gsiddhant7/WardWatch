
import { useEffect, useState } from "react";
import api from "../../api/axios";

function CitizenManagement() {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch registered citizens from the backend
  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/citizens");

        setCitizens(response.data.citizens || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load citizens. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  // Search by name, email, phone number, or MongoDB ID
  const filteredCitizens = citizens.filter((citizen) => {
    const searchText = search.toLowerCase().trim();

    return (
      citizen.name?.toLowerCase().includes(searchText) ||
      citizen.email?.toLowerCase().includes(searchText) ||
      citizen.phone?.toLowerCase().includes(searchText) ||
      citizen._id?.toLowerCase().includes(searchText)
    );
  });

  // Format MongoDB registration date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="admin-citizens-page">
      <div className="admin-page-header">
        <div>
          <h1>Manage Citizens</h1>
          <p>View and manage citizens registered on WardWatch.</p>
        </div>
      </div>

      <section className="citizen-summary">
        <div className="citizen-summary-card">
          <div className="citizen-summary-icon blue">♙</div>
          <div>
            <span>Total Citizens</span>
            <h2>{citizens.length}</h2>
          </div>
        </div>

        <div className="citizen-summary-card">
          <div className="citizen-summary-icon green">✓</div>
          <div>
            <span>Showing Results</span>
            <h2>{filteredCitizens.length}</h2>
          </div>
        </div>

        <div className="citizen-summary-card">
          <div className="citizen-summary-icon orange">◷</div>
          <div>
            <span>Registered This Month</span>
            <h2>
              {citizens.filter((citizen) => {
                const date = new Date(citizen.createdAt);
                const now = new Date();

                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              }).length}
            </h2>
          </div>
        </div>
      </section>

      <section className="admin-panel citizen-management-panel">
        <div className="citizen-panel-heading">
          <div>
            <h2>Registered Citizens</h2>
            <p>Search and view citizen account information.</p>
          </div>

          <span className="citizen-result-count">
            {filteredCitizens.length} citizens found
          </span>
        </div>

        <div className="citizen-filters">
          <div className="citizen-search">
            <label htmlFor="citizen-search">
              Search citizens
            </label>

            <input
              id="citizen-search"
              type="text"
              placeholder="Search by name, email, phone or citizen ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table citizen-table">
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Joined Date</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="citizen-empty-state">
                    Loading citizens...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="citizen-empty-state">
                    {error}
                  </td>
                </tr>
              ) : filteredCitizens.length > 0 ? (
                filteredCitizens.map((citizen) => (
                  <tr key={citizen._id}>
                    <td>
                      <strong>{citizen.name}</strong>
                      <span className="admin-complaint-id">
                        ID: {citizen._id}
                      </span>
                    </td>

                    <td>{citizen.email}</td>
                    <td>{citizen.phone}</td>
                    <td>{formatDate(citizen.createdAt)}</td>

                    <td>
                      <span className="citizen-status-badge active">
                        Registered
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="citizen-view-button"
                        onClick={() =>
                          alert(
                            `Citizen: ${citizen.name}\nEmail: ${citizen.email}\nPhone: ${citizen.phone}\nID: ${citizen._id}`
                          )
                        }
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="citizen-empty-state">
                    No citizens match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CitizenManagement;
