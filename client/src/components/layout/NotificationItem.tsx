import { cn } from '@/lib/utils';

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: string;
}

interface NotificationItemProps {
  notification: Notification;
  variant?: 'default' | 'compact';
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  variant = 'default',
  onClick,
}) => {
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors',
          notification.unread && 'bg-gray-50/50'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0 text-sm">
            {notification.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
              {notification.unread && (
                <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1.5 line-clamp-2">{notification.description}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </div>
        </div>
      </div>
    );
  }

  // Default mobile variant
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-5 py-4 active:bg-gray-50 transition-colors border-b border-gray-100',
        notification.unread && 'bg-gray-50/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{notification.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
            {notification.unread && <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0 mt-1.5" />}
          </div>
          <p className="text-sm text-gray-600 mb-2 leading-relaxed">{notification.description}</p>
          <p className="text-xs text-gray-500">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};
