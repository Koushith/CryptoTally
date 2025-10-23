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
  const [isMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <AppSidebar isMobileMenuOpen={isMobileMenuOpen} />
        <main className="md:ml-[280px] flex-1 min-h-screen bg-white">
          <div className="p-8 max-w-[1500px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AppSidebar({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen w-[280px] bg-white/80 backdrop-blur-sm border-r border-neutral-200 transition-transform duration-200 ease-in-out',
        'md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-6">
          <Logo />
        </div>
        <div className="flex flex-col gap-1 p-3 flex-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/" />
          <NavItem icon={<Wallet size={18} />} label="Wallets" to="/wallets" />
          <NavItem icon={<ArrowLeftRight size={18} />} label="Transactions" to="/transactions" />
          <NavItem icon={<FileText size={18} />} label="Reports" to="/reports" />
          <NavItem icon={<Settings size={18} />} label="Settings" to="/settings" />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Developer</div>
          </div>
          <NavItem icon={<Key size={18} />} label="API Keys" to="/api-keys" />
          <NavItem icon={<Webhook size={18} />} label="Webhooks" to="/webhooks" />
          <NavItem icon={<FileCode size={18} />} label="Documentation" to="/documentation" />
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

function NavItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-md transition-colors',
          isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <span className={cn('flex-shrink-0 w-[18px] h-[18px]')}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
