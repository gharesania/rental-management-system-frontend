import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Common
import NotFound from "./pages/Common/NotFound";
import Profile from "./pages/Common/Profile";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Buildings from "./pages/Admin/Buildings";
import Rooms from "./pages/Admin/Rooms";
import Tenants from "./pages/Admin/Tenants";


// Tenant
import TenantDashboard from "./pages/Tenant/TenantDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Route */}
        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Building */}
        <Route
          path="/admin/buildings"
          element={
            <ProtectedRoute>
              <Buildings />
            </ProtectedRoute>
          }
        />

        {/* Admin Room */}
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />

        {/* Get All Tenants */}
        <Route
          path="/admin/tenants"
          element={
            <ProtectedRoute>
              <Tenants />
            </ProtectedRoute>
          }
        />

        {/* Tenant Route */}
        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Common Protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
