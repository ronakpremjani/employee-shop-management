import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Left side: Premium Branding & Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black flex-col justify-between p-12 border-r border-zinc-900 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

        {/* Top: Brand Header */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
            ES
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            ShopManager
          </span>
        </div>

        {/* Center: Abstract Graphical Feature Card */}
        <div className="relative my-auto max-w-md z-10 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
              Enterprise Ready
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              The control center for your team and shop operations.
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Track attendance, manage salaries, log advance payouts, and process employee store ledger entries with Stripe-like simplicity.
            </p>
          </div>

          {/* Micro Preview Component representing the app */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md space-y-4 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live System Overview</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-medium">All APIs Operational</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Active Staff</span>
                <p className="text-lg font-bold text-white">100% Present</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Salary Disbursed</span>
                <p className="text-lg font-bold text-white">₹4,82,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="text-xs text-zinc-500 z-10 flex justify-between items-center">
          <p>© 2026 ShopManager Inc.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md z-10 space-y-6">
          {/* Logo showing only on mobile */}
          <div className="flex lg:hidden items-center space-x-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white">
              ES
            </div>
            <span className="text-xl font-bold tracking-wider text-white">
              ShopManager
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

