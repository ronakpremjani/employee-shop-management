import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuToggle, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur-md">
      {/* Left side: Hamburger & Search */}
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative hidden sm:block w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications Icon */}
        <button
          className="relative text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 ring-2 ring-zinc-950" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1 hover:bg-zinc-900/60 rounded-lg border border-transparent hover:border-zinc-800 transition-all text-left cursor-pointer"
          >
            {/* Avatar Circle */}
            <div className="w-7 h-7 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-xs uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            
            <div className="hidden md:block select-none">
              <p className="text-xs font-semibold text-zinc-200 tracking-tight">{user?.name || 'User'}</p>
              <p className="text-[9px] font-medium text-zinc-500 capitalize">{user?.role || 'Staff'}</p>
            </div>
            
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-52 bg-zinc-950 rounded-lg border border-zinc-800/80 shadow-2xl z-50 py-1 animate-fade-in">
                <div className="px-4 py-2 border-b border-zinc-900/60">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user?.email || ''}</p>
                </div>
                
                <Link
                  to={user?.role === 'admin' ? '/admin/profile' : '/staff/profile'}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <User className="w-3.5 h-3.5 mr-2.5 text-zinc-500" />
                  My Profile
                </Link>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-colors border-t border-zinc-900/60"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2.5" />
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
