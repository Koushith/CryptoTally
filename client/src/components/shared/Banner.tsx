import React from 'react';
import { Info, X, LucideIcon } from 'lucide-react';

interface BannerProps {
  title: string;
  message: string | React.ReactNode;
  onClose: () => void;
  variant?: 'info' | 'warning' | 'success' | 'error';
  icon?: LucideIcon;
}

export const Banner: React.FC<BannerProps> = ({
  title,
  message,
  onClose,
  variant = 'info',
  icon: Icon = Info,
}) => {
  const variantStyles = {
    info: 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white',
    warning: 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white',
    success: 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white',
    error: 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white',
  };

  return (
    <div className={`${variantStyles[variant]} rounded-2xl p-4 mb-8 shadow-lg`}>
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">
            <span className="font-medium">{title}</span> — {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded flex-shrink-0 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
