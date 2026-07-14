import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  HandCoins,
  ShoppingBag,
  DollarSign,
  UserCircle,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, role = 'staff', onLogout }) => {
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/staff', label: 'Staff Directory', icon: Users },
    { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/admin/leaves', label: 'Leave Requests', icon: CalendarDays },
    { to: '/admin/advances', label: 'Advance Salary', icon: HandCoins },
    { to: '/admin/purchases', label: 'Item Purchases', icon: ShoppingBag },
    { to: '/admin/salaries', label: 'Salary Ledger', icon: DollarSign },
    { to: '/admin/profile', label: 'Profile', icon: UserCircle },
  ];

  const staffLinks = [
    { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/staff/attendance', label: 'My Attendance', icon: CalendarCheck },
    { to: '/staff/leaves', label: 'My Leaves', icon: CalendarDays },
    { to: '/staff/advances', label: 'Advance Request', icon: HandCoins },
    { to: '/staff/purchases', label: 'My Purchases', icon: ShoppingBag },
    { to: '/staff/salaries', label: 'My Salary Slips', icon: DollarSign },
    { to: '/staff/profile', label: 'My Profile', icon: UserCircle },
  ];

  const links = role === 'admin' ? adminLinks : staffLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b0f19]/90 border-r border-white/5 backdrop-blur-md">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            ES
          </div>
          <span className="text-lg font-bold tracking-wider text-white bg-clip-text">
            ShopManager
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}
                />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
