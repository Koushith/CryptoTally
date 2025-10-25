import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  FileText,
  Settings,
  Key,
  Webhook,
  FileCode,
  Bell,
  User,
  MessageSquare,
  Plug,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_USER, MOCK_NOTIFICATIONS } from '@/constants/user';
import { Logo } from '@/components/shared/Logo';
import { MobileHeader } from './MobileHeader';
import { MobileNotifications } from './MobileNotifications';
import { MobileBottomNav } from './MobileBottomNav';
import { PromotionalCard } from './PromotionalCard';
import { UserProfileSection } from './UserProfileSection';
import { NotificationItem } from './NotificationItem';

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onNotificationsOpen={() => setIsNotificationsOpen(true)}
        hasUnread={hasUnread}
        userInitial={MOCK_USER.name.charAt(0)}
      />

      {/* Mobile Fullscreen Notifications */}
      <MobileNotifications
        isOpen={isNotificationsOpen}
        notifications={MOCK_NOTIFICATIONS}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllRead={() => setHasUnread(false)}
      />

      <div className="flex">
        <AppSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="md:ml-[280px] flex-1 min-h-screen bg-gray-50 pt-14 md:pt-0 pb-24 md:pb-0">
          <div className="p-5 md:p-8 max-w-[1500px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-[35]" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}

function AppSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}) {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-neutral-200 transition-transform duration-200 ease-in-out z-[40]',
        'w-full md:w-[280px]',
        'md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="h-full flex flex-col">
        {/* Desktop Header with Logo & Notifications */}
        <div className="p-6 hidden md:flex items-center justify-between">
          <Logo />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                <Bell className="h-4 w-4" />
                {hasUnread && <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((notification, idx, arr) => (
                  <div key={notification.id} className={cn(idx !== arr.length - 1 && 'border-b border-gray-100')}>
                    <NotificationItem notification={notification} variant="compact" />
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setHasUnread(false)}
                  className="text-xs text-gray-700 hover:text-gray-900 font-medium w-full text-center py-1"
                >
                  Mark all as read
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1 p-3 flex-1 pt-6 md:pt-3">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            icon={<Wallet size={18} />}
            label="Wallets"
            to="/wallets"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            icon={<ArrowLeftRight size={18} />}
            label="Transactions"
            to="/transactions"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            icon={<FileText size={18} />}
            label="Reports"
            to="/reports"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Account</div>
          </div>
          <NavItem icon={<User size={18} />} label="Profile" to="/profile" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Support</div>
          </div>
          <NavItem
            icon={<MessageSquare size={18} />}
            label="Feedback"
            to="/feedback"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Developer</div>
          </div>
          <NavItem
            icon={<Plug size={18} />}
            label="Integrations"
            to="/integrations"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            icon={<Key size={18} />}
            label="API Keys"
            to="/api-keys"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            icon={<Webhook size={18} />}
            label="Webhooks"
            to="/webhooks"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.open('https://docs.cryptotally.xyz/', '_blank');
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="flex-shrink-0 w-[18px] h-[18px]">
              <FileCode size={18} />
            </span>
            <span>Documentation</span>
          </button>
        </div>

        {/* Promotional Card */}
        <div className="px-4 pb-4 mt-auto">
          <PromotionalCard
            title="Join the Waitlist"
            description="Get early access to new features and updates. Be the first to know."
            buttonText="Join Waitlist"
            buttonLink="/waitlist"
          />
        </div>

        {/* User Profile Section */}
        <UserProfileSection user={MOCK_USER} />
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors',
          isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <span className={cn('flex-shrink-0 w-[18px] h-[18px]')}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
