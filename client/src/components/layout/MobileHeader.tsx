import { Bell } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  onNotificationsOpen: () => void;
  hasUnread: boolean;
  userInitial: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  onNotificationsOpen,
  hasUnread,
  userInitial,
}) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white z-50 flex items-center justify-between px-5 shadow-sm">
      {/* Left side - Logo (clickable to open menu) */}
      <button
        onClick={onMenuToggle}
        className="flex items-center gap-2 active:opacity-70 transition-opacity"
      >
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
          <span className="text-sm font-bold text-white">CT</span>
        </div>
      </button>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNotificationsOpen}
          className="relative h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl active:bg-gray-50 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-red-600 rounded-full" />
          )}
        </button>

        <button className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{userInitial}</span>
        </button>
      </div>
    </div>
  );
};
