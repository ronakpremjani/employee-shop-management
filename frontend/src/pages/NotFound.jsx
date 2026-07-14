import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const { user } = useSelector((state) => state.auth);
  
  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090e] px-4 text-center">
      {/* Decorative Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md space-y-6 z-10 animate-fade-in">
        <div className="inline-flex p-4 bg-white/5 rounded-2xl border border-white/5 shadow-xl text-blue-500">
          <AlertCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-white tracking-wide">Page Not Found</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or you don't have permissions to access it.
          </p>
        </div>

        <Link
          to={dashboardLink}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-900/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
