
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/public/Home";
import CommunityFeed from "./pages/public/CommunityFeed";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";

import Dashboard from "./pages/citizen/Dashboard";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetails from "./pages/citizen/ComplaintDetails";
import Profile from "./pages/citizen/Profile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import ComplaintReview from "./pages/admin/ComplaintReview";
import CitizenManagement from "./pages/admin/CitizenManagement";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import AdminProfile from "./pages/admin/AdminProfile";

function ProtectedRoute({ allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to={allowedRole === "Ward Administrator" ? "/admin/login" : "/login"}
        replace
      />
    );
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "Ward Administrator" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/complaints" element={<CommunityFeed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRole="Citizen" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute allowedRole="Ward Administrator" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<ComplaintManagement />} />
          <Route path="complaints/:id" element={<ComplaintReview />} />
          <Route path="citizens" element={<CitizenManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
