import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend, // { type: 'up' | 'down', value: '12%' }
  trendLabel = 'vs last month',
  className = '',
  isLoading = false,
}) => {
  return (
    <div className={`bg-zinc-950 p-5 rounded-lg border border-zinc-900 shadow-sm transition-all duration-200 hover:border-zinc-800 hover:shadow-md group ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block select-none">
            {title}
          </span>
          {isLoading ? (
            <div className="h-7 bg-zinc-900 rounded w-1/2 animate-pulse" />
          ) : (
            <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          )}
          
          {!isLoading && trend && (
            <div className="flex items-center space-x-1.5 text-[10px] font-semibold">
              <span
                className={`px-1.5 py-0.5 rounded ${
                  trend.type === 'up' 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {trend.type === 'up' ? '+' : '-'}{trend.value}
              </span>
              <span className="text-zinc-500 font-medium">{trendLabel}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="p-2 bg-zinc-900 border border-zinc-800/80 rounded-md text-zinc-400 group-hover:text-blue-500 group-hover:border-blue-500/10 group-hover:bg-blue-500/5 transition-all">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
