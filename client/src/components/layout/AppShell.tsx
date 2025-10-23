import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  FileText,
  Settings,
  LogOut,
  Coins,
  Key,
  Webhook,
  FileCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* User Profile Section with Dropdown */}
        <div className="p-4 border-t mt-auto">
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
