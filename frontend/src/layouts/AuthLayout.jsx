import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07090e] px-4 py-12 overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10">
        <div className="glass p-8 rounded-2xl border border-white/5 shadow-2xl relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
