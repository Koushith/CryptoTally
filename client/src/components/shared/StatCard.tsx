import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  value: string | number;
  subvalue?: string;
  variant?: 'default' | 'hero';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconBgColor = 'bg-gray-100',
  iconColor = 'text-gray-900',
  label,
  sublabel,
  value,
  subvalue,
  variant = 'default',
  className = '',
}) => {
  if (variant === 'hero') {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Icon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {label}
            </span>
          </div>
          <p className="text-5xl font-bold mb-4">{value}</p>
          {subvalue && <p className="text-gray-400">{subvalue}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          {sublabel && <p className="text-sm text-gray-600">{sublabel}</p>}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subvalue && <p className="text-sm text-gray-500">{subvalue}</p>}
    </div>
  );
};
