import { X } from 'lucide-react';
import { NotificationItem, Notification } from './NotificationItem';

interface MobileNotificationsProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const MobileNotifications: React.FC<MobileNotificationsProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-gray-200">
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center active:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">Notifications</h1>
        <button
          onClick={onMarkAllRead}
          className="text-xs text-gray-700 active:text-gray-900 font-medium px-2"
        >
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
};
