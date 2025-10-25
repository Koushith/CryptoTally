import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string | number;
  valueLabel: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: 'info' | 'warning' | 'success' | 'error';
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon: Icon,
  title,
  description,
  value,
  valueLabel,
  actionLabel,
  actionHref,
  onAction,
  variant = 'warning',
}) => {
  const variantStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-600',
      buttonBg: 'bg-orange-600 hover:bg-orange-700',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
      buttonBg: 'bg-green-600 hover:bg-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    },
  };

  const styles = variantStyles[variant];

  const ButtonWrapper = actionHref ? 'a' : 'button';
  const buttonProps = actionHref ? { href: actionHref } : { onClick: onAction };

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-2xl p-6`}>
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`h-5 w-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className={`text-3xl font-bold ${styles.valueColor}`}>{value}</p>
          <p className="text-xs text-gray-600">{valueLabel}</p>
        </div>
      </div>
      <ButtonWrapper
        {...buttonProps}
        className={`block w-full ${styles.buttonBg} text-white text-center py-2.5 rounded-lg font-medium transition-colors`}
      >
        {actionLabel}
      </ButtonWrapper>
    </div>
  );
};
