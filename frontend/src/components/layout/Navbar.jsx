import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuToggle, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0b0f19]/40 backdrop-blur-md">
      {/* Left side: Hamburger & Search */}
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search placeholder */}
        <div className="relative hidden sm:block w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full bg-slate-900/60 border border-white/5 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications Icon placeholder */}
        <button
          className="relative text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-[#0b0f19]" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all text-left"
          >
            {/* Avatar Circle */}
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/25 flex items-center justify-center font-bold text-blue-400">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="hidden md:block select-none">
              <p className="text-xs font-semibold text-white tracking-wide">{user?.name || 'User'}</p>
              <p className="text-[10px] font-medium text-gray-400 capitalize">{user?.role || 'Staff'}</p>
            </div>
            
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2.5 w-56 glass rounded-xl border border-white/10 shadow-2xl z-50 py-1.5 animate-fade-in">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
                </div>
                
                <Link
                  to={user?.role === 'admin' ? '/admin/profile' : '/staff/profile'}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4 mr-2.5 text-gray-400" />
                  My Profile
                </Link>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
