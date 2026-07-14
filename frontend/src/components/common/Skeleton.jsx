import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClass = 'animate-pulse bg-slate-800 rounded';
  
  if (variant === 'circle') {
    return <div className={`${baseClass} rounded-full ${className}`} />;
  }
  
  if (variant === 'card') {
    return (
      <div className={`${baseClass} p-6 border border-white/5 space-y-4`}>
        <div className="h-4 bg-slate-700 rounded w-1/3" />
        <div className="h-8 bg-slate-700 rounded w-2/3" />
        <div className="h-3 bg-slate-700 rounded w-1/2" />
      </div>
    );
  }

  return <div className={`${baseClass} ${className}`} />;
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-6 bg-slate-800 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-10 bg-slate-800 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
