
import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#16a34a", "#64748b"];

function ReportsAnalytics() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [complaintsResponse, statsResponse] = await Promise.all([
          api.get("/complaints/admin"),
          api.get("/users/admin/stats"),
        ]);

        setComplaints(complaintsResponse.data.complaints || []);
        setStats(statsResponse.data.stats);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  const total = stats?.totalComplaints || 0;
  const resolved = stats?.resolved || 0;
  const pending = (stats?.submitted || 0) + (stats?.underReview || 0);
  const resolutionRate = total
    ? Math.round((resolved / total) * 100)
    : 0;

  const statusData = [
    { name: "Submitted", value: stats?.submitted || 0 },
    { name: "Under Review", value: stats?.underReview || 0 },
    { name: "In Progress", value: stats?.inProgress || 0 },
    { name: "Resolved", value: resolved },
  ];

  const categoryData = [
    "Roads and Footpaths",
    "Water Supply",
    "Waste Management",
    "Streetlights",
    "Drainage",
    "Other",
  ].map((name) => ({
    name,
    value: complaints.filter((item) => item.category === name).length,
  }));

  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (5 - index),
      1
    );

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear(),
      complaints: complaints.filter((item) => {
        const created = new Date(item.createdAt);
        return (
          created.getMonth() === date.getMonth() &&
          created.getFullYear() === date.getFullYear()
        );
      }).length,
    };
  });

  return (
    <div className="admin-page reports-page">
      <div className="admin-page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Overview of ward complaints and resolution performance.</p>
        </div>
      </div>

      <div className="report-stats">
        <div className="report-stat-card">
          <span>Total Complaints</span>
          <h2>{total}</h2>
          <p>All active complaints</p>
        </div>

        <div className="report-stat-card">
          <span>Resolved Complaints</span>
          <h2>{resolved}</h2>
          <p>Successfully resolved</p>
        </div>

        <div className="report-stat-card">
          <span>Pending Complaints</span>
          <h2>{pending}</h2>
          <p>Submitted or awaiting review</p>
        </div>

        <div className="report-stat-card">
          <span>Resolution Rate</span>
          <h2>{resolutionRate}%</h2>
          <p>Resolved out of active complaints</p>
        </div>
      </div>

      <div className="report-chart-grid">
        <div className="report-chart-card">
          <h3>Monthly Complaints</h3>
          <p>Complaints received over the last six months</p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="complaints"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-chart-card">
          <h3>Complaints by Status</h3>
          <p>Current distribution of complaint statuses</p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-chart-card report-category-chart">
          <h3>Complaints by Category</h3>
          <p>Distribution across different issue categories</p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#16a34a"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsAnalytics;
