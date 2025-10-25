import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-9 w-9 text-lg',
    lg: 'h-12 w-12 text-xl',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative flex items-center justify-center rounded-lg bg-gray-900 ${sizeClasses[size]}`}
      >
        <span className={`font-bold text-white ${sizeClasses[size].includes('text-sm') ? 'text-sm' : sizeClasses[size].includes('text-lg') ? 'text-lg' : 'text-xl'}`}>
          CT
        </span>
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          CryptoTally
        </span>
      )}
    </div>
  );
};
