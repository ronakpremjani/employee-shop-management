import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import Navbar from '../components/layout/Navbar';
import toast from '../utils/toast';
import { Clock } from 'lucide-react';

const UserLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar 
        onMenuToggle={() => setSidebarOpen(true)} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full glass p-8 rounded-3xl border border-white/5 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white tracking-tight">Pending Approval</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your account has been created successfully and is currently under review by an Administrator. 
            You will be granted staff access once approved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
