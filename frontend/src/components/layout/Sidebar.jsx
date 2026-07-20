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
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900/60 font-sans">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/10">
            ES
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            ShopManager
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-150 group border border-transparent ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-800 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-4 h-4 mr-3 transition-colors ${
                    isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-zinc-900/60">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4 mr-3" />
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;

