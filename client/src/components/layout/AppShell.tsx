import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  FileText,
  Settings,
  LogOut,
  Key,
  Webhook,
  FileCode,
  X,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock user data - replace with your actual user data
const user = {
  name: 'Koushith Amin',
  email: 'koushith@def.com',
  imageUrl: 'https://pbs.twimg.com/profile_images/1733931010977640448/KTlA02mC_400x400.jpg', // Replace with actual user image
};

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: 'New transaction detected',
    description: '+5,000 USDC received in Treasury Wallet',
    time: '2h ago',
    unread: true,
    icon: '↓',
  },
  {
    id: 2,
    title: 'Wallet balance updated',
    description: 'Operations wallet balance changed by 15%',
    time: '5h ago',
    unread: true,
    icon: '📊',
  },
  {
    id: 3,
    title: 'Weekly report ready',
    description: 'Your weekly transaction summary is ready',
    time: '1d ago',
    unread: true,
    icon: '📄',
  },
  {
    id: 4,
    title: 'New team member',
    description: 'Sarah Johnson joined your workspace',
    time: '2d ago',
    unread: false,
    icon: '👤',
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900">
        <span className="text-lg font-bold text-white">CT</span>
      </div>
      <span className="text-xl font-bold text-gray-900">CryptoTally</span>
    </div>
  );
}

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Peerlist Style */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white z-50 flex items-center justify-between px-5 shadow-sm">
        {/* Left side - Logo */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <span className="text-sm font-bold text-white">CT</span>
          </div>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl active:bg-gray-50 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {hasUnread && (
              <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-red-600 rounded-full" />
            )}
          </button>

          <button className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">K</span>
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Notifications */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[60] flex flex-col">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-5 border-b border-gray-200">
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="h-8 w-8 flex items-center justify-center active:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-semibold text-gray-900">Notifications</h1>
            <button
              onClick={() => setHasUnread(false)}
              className="text-xs text-gray-700 active:text-gray-900 font-medium px-2"
            >
              Mark all read
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
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
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex">
        <AppSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="md:ml-[280px] flex-1 min-h-screen bg-gray-50 pt-14 md:pt-0 pb-20 md:pb-0">
          <div className="p-5 md:p-8 max-w-[1500px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-[100] safe-area-inset-bottom">
        <div className="flex items-center justify-around h-full px-2 pb-safe"
             style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
          <NavLink
            to="/"
            className={({ isActive }) => `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all ${
              isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
            }`}
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'font-semibold' : ''}`}>Dashboard</span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/wallets"
            className={({ isActive }) => `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all ${
              isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
            }`}
          >
            {({ isActive }) => (
              <>
                <Wallet size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'font-semibold' : ''}`}>Wallets</span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) => `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all ${
              isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
            }`}
          >
            {({ isActive }) => (
              <>
                <ArrowLeftRight size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'font-semibold' : ''}`}>Transactions</span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) => `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all ${
              isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
            }`}
          >
            {({ isActive }) => (
              <>
                <FileText size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'font-semibold' : ''}`}>Reports</span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all ${
              isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
            }`}
          >
            {({ isActive }) => (
              <>
                <Settings size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'font-semibold' : ''}`}>Settings</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

function AppSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: { isMobileMenuOpen: boolean; setIsMobileMenuOpen: (open: boolean) => void }) {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-sm border-r border-neutral-200 transition-transform duration-200 ease-in-out z-40',
        'w-full md:w-[280px]',
        'md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 hidden md:flex items-center justify-between">
          <Logo />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                <Bell className="h-4 w-4" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {notifications.map((notification, idx, arr) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors',
                      notification.unread && 'bg-gray-50/50',
                      idx !== arr.length - 1 && 'border-b border-gray-100'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0 text-sm">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1.5 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
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
        <div className="flex flex-col gap-1 p-3 flex-1 pt-6 md:pt-3">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<Wallet size={18} />} label="Wallets" to="/wallets" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<ArrowLeftRight size={18} />} label="Transactions" to="/transactions" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<FileText size={18} />} label="Reports" to="/reports" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<Settings size={18} />} label="Settings" to="/settings" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Developer</div>
          </div>
          <NavItem icon={<Key size={18} />} label="API Keys" to="/api-keys" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<Webhook size={18} />} label="Webhooks" to="/webhooks" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<FileCode size={18} />} label="Documentation" to="/documentation" onClick={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* Promotional Card */}
        <div className="px-4 pb-4 mt-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            <div className="relative">
              <div className="mb-3">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Join the Waitlist</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Get early access to new features and updates. Be the first to know.
                </p>
              </div>
              <Button
                size="sm"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile Section with Dropdown */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 px-3 -ml-3 h-auto">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="top">
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, to, onClick }: { icon: React.ReactNode; label: string; to: string; onClick?: () => void }) {
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
