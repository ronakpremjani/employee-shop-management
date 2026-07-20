import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { logout } from '../store/authSlice';

const StaffLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Allow admins to view staff pages or redirect if inactive?
  if (user?.role !== 'staff' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If user status is Inactive, block them and show notification
  if (user?.status === 'Inactive') {
    dispatch(logout());
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="staff"
        onLogout={handleLogout}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Navbar */}
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-950 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <Breadcrumbs />
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
