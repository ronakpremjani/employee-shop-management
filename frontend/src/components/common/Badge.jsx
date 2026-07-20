import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const normalized = status.toLowerCase();
  
  const statusStyles = {
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    
    inactive: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    
    deducted: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    salary: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    
    default: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  };

  const currentStyle = statusStyles[normalized] || statusStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${currentStyle} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

