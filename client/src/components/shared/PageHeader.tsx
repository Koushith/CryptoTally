import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="mb-5 md:mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-[32px] font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-gray-500 text-sm mt-1 md:mt-2">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
