import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Wallet, Receipt, Settings, Users, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
  },
  {
    title: 'Wallets',
    icon: <Wallet className="h-5 w-5" />,
    href: '/wallets',
  },
  {
    title: 'Transactions',
    icon: <Receipt className="h-5 w-5" />,
    href: '/transactions',
  },
  {
    title: 'Team',
    icon: <Users className="h-5 w-5" />,
    href: '/team',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
];

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground"
            >
              <path d="M16 2L2 16L16 30L30 16L16 2Z" stroke="currentColor" strokeWidth="2" />
              <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="currentColor" />
            </svg>
            <span className="font-semibold">CryptoTally</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform duration-300 md:translate-x-0',
          !isSidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {item.icon}
                {item.title}
              </a>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex flex-1 items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">john@example.com</span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn('min-h-[calc(100vh-3.5rem)] transition-all duration-300 mt-14', isSidebarOpen ? 'md:pl-64' : '')}
      >
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
