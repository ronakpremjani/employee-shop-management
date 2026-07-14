import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import StaffCRUD from '../pages/admin/StaffCRUD';
import AdminAttendance from '../pages/admin/Attendance';
import AdminLeaves from '../pages/admin/Leaves';
import AdminAdvances from '../pages/admin/Advances';
import AdminPurchases from '../pages/admin/Purchases';
import AdminSalaries from '../pages/admin/Salaries';

// Staff Pages
import StaffDashboard from '../pages/staff/Dashboard';
import StaffAttendance from '../pages/staff/Attendance';
import StaffLeaves from '../pages/staff/Leaves';
import StaffAdvances from '../pages/staff/Advances';
import StaffPurchases from '../pages/staff/Purchases';
import StaffSalaries from '../pages/staff/Salaries';

// Shared Pages
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="staff" element={<StaffCRUD />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="leaves" element={<AdminLeaves />} />
        <Route path="advances" element={<AdminAdvances />} />
        <Route path="purchases" element={<AdminPurchases />} />
        <Route path="salaries" element={<AdminSalaries />} />
        <Route path="profile" element={<Profile />} />
        {/* Redirect empty sub-paths */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Staff Protected Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="attendance" element={<StaffAttendance />} />
        <Route path="leaves" element={<StaffLeaves />} />
        <Route path="advances" element={<StaffAdvances />} />
        <Route path="purchases" element={<StaffPurchases />} />
        <Route path="salaries" element={<StaffSalaries />} />
        <Route path="profile" element={<Profile />} />
        {/* Redirect empty sub-paths */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Wildcard 404 Route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
