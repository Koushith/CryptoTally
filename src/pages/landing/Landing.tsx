import { Button } from '@/components/ui/button';
import {
  Wallet,
  Shield,
  Check,
  Users,
  Cog,
  Menu,
  X,
  Tags,
  LineChart,
  FileText,
  Building2,
  Palette,
  Twitter,
  Github,
  Rocket,
  Lightbulb,
  Receipt,
  Brain,
  BarChart3,
  DollarSign,
  Settings,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { WaitlistModal } from '@/components/waitlist-modal';
import CTAILLUSTRATION from '@/assets/cta-illustration.svg';
import CFO from '@/assets/cfo.png';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900">
        <span className="text-lg font-bold text-white">CT</span>
      </div>
      <span className="text-xl font-bold text-gray-900">CryptoTally</span>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Who is it For', href: '#who-is-it-for' },
    {
      label: 'Blog',
      href: '/blog',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/blog');
      },
    },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-6 h-20">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <Logo />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className="text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-x-0 top-20 z-50 bg-white border-b border-gray-100 lg:hidden">
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      item.onClick(e as React.MouseEvent);
                    }
                    setIsMenuOpen(false);
                  }}
                  className="block text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-12">
          {/* Logo + Links Section */}
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
              <Logo />
              <nav className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
                <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex gap-4">
                <a
                  href="https://twitter.com/koushithamin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 p-2.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/koushith"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 p-2.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section with Copyright */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-500">© 2025 CryptoTally. All rights reserved.</p>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                <p className="text-xs text-gray-500">
                  Illustrations by{' '}
                  <a
                    href="https://notioly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Notioly
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-40 pb-24 lg:px-8 lg:pt-48 lg:pb-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-10 max-w-2xl">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-[4rem] leading-[1.15] lg:leading-[1.1]">
                Crypto Accounting That Actually Makes Sense
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect your wallets. Track every transaction. Generate tax-ready reports. No spreadsheets required.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 font-semibold px-8 py-6 text-base cursor-pointer shadow-lg hover:shadow-xl transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                Join the Waitlist
              </Button>
            </div>

            <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Wallet className="h-4 w-4" />, text: 'Multi-chain' },
                { icon: <Tags className="h-4 w-4" />, text: 'Auto-categorize' },
                { icon: <FileText className="h-4 w-4" />, text: 'Tax-ready' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5">
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative lg:justify-self-end">
            <div className="relative mx-auto max-w-lg lg:max-w-xl">
              <img
                src="https://notioly.com/wp-content/uploads/2024/05/388.Bitcoin-Savings.png"
                alt="Crypto Accounting Illustration"
                className="w-full h-auto drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          {[
            {
              image: 'https://notioly.com/wp-content/uploads/2024/11/469.Money-Transfer.png',
              title: 'Track All Wallets',
              description: 'Connect wallets across Ethereum, Polygon, Arbitrum, and more',
            },
            {
              image: 'https://notioly.com/wp-content/uploads/2024/07/416.Data-Analyst.png',
              title: 'Smart Analytics',
              description: 'Automatically categorize and analyze all your crypto transactions',
            },
            {
              image: 'https://notioly.com/wp-content/uploads/2025/03/519.Reporting-Stats.png',
              title: 'Tax Reports',
              description: 'Generate quarterly and annual reports ready for your accountant',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhoIsItFor = () => {
  return (
    <section className="relative bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 text-gray-900">
            <Lightbulb className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Who This is For</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Built for Teams Running on Crypto
          </h2>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Startups accepting crypto',
                description: 'Track USDC, ETH, or token payments seamlessly',
                image: 'https://notioly.com/wp-content/uploads/2024/05/399.Business-Recipe.png',
              },
              {
                title: 'Agencies & freelancers',
                description: 'Manage crypto income and expenses effortlessly',
                image: 'https://notioly.com/wp-content/uploads/2024/07/421.Hiring.png',
              },
              {
                title: 'DAOs & grant recipients',
                description: 'Monitor multisig wallet activities in real-time',
                image: 'https://notioly.com/wp-content/uploads/2024/07/419.Money-Care.png',
              },
              {
                title: 'NFT creators',
                description: 'Track on-chain revenue and royalties automatically',
                image: 'https://notioly.com/wp-content/uploads/2024/05/398.Make-It-Rain.png',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-32 h-32 mb-4">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.gray.100),white)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-gray-900 mb-4">
            <Receipt className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Features Overview</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Everything You Need
          </h2>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-x-8 gap-y-12 lg:grid-cols-3">
            {[
              {
                icon: <Wallet className="h-5 w-5" />,
                title: 'Multi-Chain Wallets',
                features: [
                  'Connect MetaMask, Gnosis Safe, Ledger',
                  'Support for Ethereum, Polygon, Arbitrum, BNB Chain',
                  'Real-time balance tracking in USD',
                ],
              },
              {
                icon: <Tags className="h-5 w-5" />,
                title: 'Transaction Tagging',
                features: [
                  'Categorize as payments, expenses, or payroll',
                  'Add notes and invoice IDs',
                  'Auto-tag recurring transactions',
                ],
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: 'Visual Dashboards',
                features: [
                  'Income vs. expenses per wallet',
                  'Token balance summaries',
                  'Filter by category, wallet, or date',
                ],
              },
              {
                icon: <LineChart className="h-5 w-5" />,
                title: 'P&L Tracking',
                features: [
                  'FIFO/LIFO cost basis tracking',
                  'Unrealized and realized gains',
                  'Real-time portfolio valuation',
                ],
              },
              {
                icon: <DollarSign className="h-5 w-5" />,
                title: 'Tax Calculations',
                features: [
                  'Identify income events automatically',
                  'Convert to USD, EUR, or INR',
                  'Short-term and long-term capital gains',
                ],
              },
              {
                icon: <FileText className="h-5 w-5" />,
                title: 'Export Reports',
                features: [
                  'Quarterly and annual reports',
                  'Accountant-ready format',
                  'Complete transaction history with cost basis',
                ],
              },
            ].map((feature, i) => (
              <div key={i} className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <ul className="space-y-3 text-base text-gray-600">
                  {feature.features.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-gray-900 mb-4">
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Get Started in 4 Simple Steps
          </h2>
        </div>

        <div className="mx-auto max-w-5xl grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Connect Wallets',
              description: 'Link your MetaMask, Gnosis Safe, or hardware wallet in seconds',
              image: 'https://notioly.com/wp-content/uploads/2024/11/469.Money-Transfer.png',
              step: '01',
            },
            {
              title: 'Auto-Sync Transactions',
              description: 'We fetch and organize all your on-chain transactions automatically',
              image: 'https://notioly.com/wp-content/uploads/2024/06/407.Analytics.png',
              step: '02',
            },
            {
              title: 'Tag Transactions',
              description: 'Categorize as income, expenses, or payroll with custom tags',
              image: 'https://notioly.com/wp-content/uploads/2024/05/387.Targeting.png',
              step: '03',
            },
            {
              title: 'Export Reports',
              description: 'Download tax-ready reports for your accountant',
              image: 'https://notioly.com/wp-content/uploads/2025/03/519.Reporting-Stats.png',
              step: '04',
            },
          ].map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className="mb-4 text-6xl font-bold text-gray-200">{step.step}</div>
              <div className="w-32 h-32 mb-4">
                <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReadyToSimplify = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl py-16 sm:py-20 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:pt-0 xl:px-24">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        <div className="relative mx-auto w-full max-w-lg text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left xl:max-w-md">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Simplify your Crypto Accounting Today
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-300">
            Say goodbye to spreadsheets and manual tracking!
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-300">
            Be the first to manage your crypto finances like a pro — without learning accounting.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
        <div className="relative mt-16 lg:mt-8 lg:h-96">
          <img
            alt=""
            src={CTAILLUSTRATION}
            className="w-full max-w-7xl translate-x-12 scale-[1.4] lg:translate-x-20 lg:translate-y-28 lg:scale-[1.8]"
          />
        </div>
      </div>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// Extract the layout components into a shared layout
export const MainLayout = () => {
  const location = useLocation();
  const isBlogRoute = location.pathname.startsWith('/blog');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{isBlogRoute ? <Outlet /> : <LandingContent />}</main>
      <Footer />
    </div>
  );
};

// Modify LandingContent to contain just the landing page sections
export const LandingContent = () => {
  return (
    <div className="h-full overflow-x-hidden font-sans antialiased">
      <Hero />
      <WhoIsItFor />
      <Features />
      <HowItWorks />
      <ReadyToSimplify />
    </div>
  );
};
