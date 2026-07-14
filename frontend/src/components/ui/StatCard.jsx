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
    <div className={`glass p-6 rounded-2xl flex items-center justify-between border border-white/5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-black/40 group ${className}`}>
      <div className="space-y-2 flex-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        {isLoading ? (
          <div className="h-8 bg-slate-800 rounded w-2/3 animate-pulse" />
        ) : (
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</h3>
        )}
        
        {!isLoading && trend && (
          <div className="flex items-center space-x-1.5 text-xs">
            <span
              className={`font-semibold ${
                trend.type === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.type === 'up' ? '+' : '-'}{trend.value}
            </span>
            <span className="text-gray-400 font-medium">{trendLabel}</span>
          </div>
        )}
      </div>

      {Icon && (
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 group-hover:text-blue-400 transition-all text-gray-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
