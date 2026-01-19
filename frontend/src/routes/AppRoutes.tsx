/* import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/dashboard";
import { isLoggedIn } from "../api/auth";


const AppRoutes = () => {
return (
        <Routes>
            <Route path="/login"
                element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route path="/register"
                element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Register />}
            />
            <Route path="/dashboard"
                element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route path="/"
                element={<Navigate to={isLoggedIn() ? "/dashboard" : "/login"} replace />}
            />

    
        </Routes>);
}; export default AppRoutes; */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/login";
import Register from "../pages/register";
import DashboardUser from "../pages/dashboardUser";
import DashboardBusiness from "../pages/dashboardBusiness";
import Dashboard from "../pages/dashboard";
import ProtectedRoute from "./protectedRoute";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/dashboarduser" element={<DashboardUser />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["business"]} />}>
        <Route path="/dashboardBusiness" element={<DashboardBusiness />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Redirect root automatically based on role */}
      <Route
        path="/"
        element={
          user?.role === "user" ? (
            <Navigate to="/dashboarduser" replace />
          ) : user?.role === "business" ? (
            <Navigate to="/dashboardBusiness" replace />
          ) : user?.role === "admin" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
