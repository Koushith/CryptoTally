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
import { useState } from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-900"
      >
        <path d="M16 2L2 16L16 30L30 16L16 2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="currentColor" />
      </svg>
      <span className="text-xl font-bold text-gray-900">CryptoTally</span>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Who is it For', href: '#who-is-it-for' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80; // Increased height for better spacing
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-6 h-20">
        {' '}
        {/* Increased height */}
        <div className="flex items-center justify-between h-full">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            {' '}
            {/* Increased gap */}
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            <Button
              size="lg"
              className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile menu button */}
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
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-20 z-50 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-lg lg:hidden">
          <div className="flex h-full flex-col px-6">
            <div className="space-y-2 py-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-auto border-t border-gray-100 py-6">
              <Button
                className="w-full bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      )}

      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Logo + Links Section */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-x-12">
              <Logo />
              <nav className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy
                </a>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms
                </a>
                <a href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </a>
              </nav>
            </div>

            {/* Social + Copyright Section */}
            <div className="flex flex-col gap-6 sm:items-end">
              <div className="flex gap-x-4">
                <a
                  href="https://twitter.com/koushithamin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/koushith"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section with Fun Text */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">© 2025 CryptoTally. Not vibecoded - built by human haha 😄</p>
            <a
              href="https://twitter.com/koushithamin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              @koushithamin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gray-950 pt-40 pb-32 sm:pt-48 sm:pb-40">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_top_right,theme(colors.gray.800/0.15),transparent_50%)]" />
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_40%_60%,theme(colors.gray.700/0.1),transparent_30%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-20 lg:flex-row lg:items-center lg:gap-24">
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                The Easiest Way to Manage Your Company's Crypto Finances
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                Track wallet activity, tag transactions, and generate clean reports — built for startups, freelancers,
                and crypto-native teams.
              </p>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-200 font-medium transition-colors group cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Join the Waitlist
              </Button>
            </div>

            <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="mt-16 flex flex-wrap items-center gap-4">
              {[
                {
                  text: 'Built for crypto payments',
                  icon: <DollarSign className="h-4 w-4" />,
                },
                {
                  text: 'SOC 2 Compliant',
                  icon: <Shield className="h-4 w-4" />,
                },
                {
                  text: 'AI First',
                  icon: <Brain className="h-4 w-4" />,
                },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-gray-800/80 to-gray-700/50 px-5 py-2 ring-1 ring-gray-700 transition-all hover:ring-gray-500"
                >
                  <span className="rounded-full bg-gray-800 p-1.5 text-white ring-1 ring-gray-700 group-hover:text-white">
                    {badge.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-100">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-10">
              <div className="grid gap-8">
                {[
                  {
                    icon: <Brain className="h-5 w-5" />,
                    title: 'Smart Transaction Tagging',
                    description: 'AI-powered system learns and auto-categorizes your recurring transactions',
                  },
                  {
                    icon: <Wallet className="h-5 w-5" />,
                    title: 'Multi-wallet Support',
                    description: 'Connect and track unlimited wallets across chains with automated syncing',
                  },
                  {
                    icon: <FileText className="h-5 w-5" />,
                    title: 'Intelligent Reporting',
                    description: 'Smart templates adapt to your business needs for tax and audit reports',
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-5 rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm">
                    <div className="rounded-lg bg-gray-700 p-3 text-white">{feature.icon}</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-200">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-xl bg-gray-800/50 p-8">
                <div className="flex items-center justify-between border-b border-gray-700 pb-6">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-200">Early Access Benefits</h4>
                    <p className="text-sm text-gray-400">Join the waitlist today</p>
                  </div>
                  <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                    Coming Soon
                  </span>
                </div>
                <ul className="mt-6 space-y-4 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Priority access to smart features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Extended free trial period
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Early adopter pricing benefits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhoIsItFor = () => {
  return (
    <section className="relative bg-white py-16 sm:py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-1/2 translate-x-1/2 w-full overflow-hidden">
          <div className="absolute top-0 left-0 -translate-x-[60%] -translate-y-[40%] w-[120%] h-[180%] -rotate-12">
            <div className="absolute inset-0 space-y-2 opacity-5">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="h-2 bg-gray-500" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-900">
            <Lightbulb className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Who This is For</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            If you run on crypto, you need more than a spreadsheet.
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-y-8 gap-x-12 lg:grid-cols-2">
            {/* Left column: Use cases */}
            <div className="space-y-6">
              {[
                {
                  title: 'Startups accepting crypto',
                  description: 'Track USDC, ETH, or token payments seamlessly',
                  icon: <Building2 className="h-5 w-5" />,
                },
                {
                  title: 'Agencies & freelancers',
                  description: 'Manage crypto income and expenses effortlessly',
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  title: 'DAOs & grant recipients',
                  description: 'Monitor multisig wallet activities in real-time',
                  icon: <Wallet className="h-5 w-5" />,
                },
                {
                  title: 'NFT creators',
                  description: 'Track on-chain revenue and royalties automatically',
                  icon: <Palette className="h-5 w-5" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-base text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column: Summary */}
            <div className="flex items-center">
              <div className="rounded-2xl bg-gray-900 p-8 text-white">
                <p className="text-2xl font-medium leading-relaxed tracking-tight">
                  No CFO? No problem. This tool is your crypto ledger, P&L dashboard, and tax buddy — all in one.
                </p>
              </div>
            </div>
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
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 text-gray-900">
            <Receipt className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Features Overview</span>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-x-8 gap-y-12 lg:grid-cols-3">
            {[
              {
                icon: <Brain className="h-5 w-5" />,
                title: 'Track Multi-Chain Wallets',
                features: [
                  'Connect EVM wallets: MetaMask, Gnosis, Ledger',
                  'See balances across Ethereum, Polygon, Arbitrum, BNB Chain',
                  'Real-time fiat value per token and per wallet',
                ],
              },
              {
                icon: <Tags className="h-5 w-5" />,
                title: 'Smart Transaction Tagging',
                features: [
                  'Inflow/outflow tagging: payments, payroll, expenses, grants',
                  'Add notes, invoice IDs, and tag rules',
                  'Auto-tag known wallets and repetitive activity',
                ],
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: 'Clean Dashboards',
                features: [
                  'Inflows vs. outflows per wallet or business unit',
                  'Token-specific summaries',
                  'Filter by tag, wallet, token, date',
                ],
              },
              {
                icon: <LineChart className="h-5 w-5" />,
                title: 'Real-Time P&L Tracking',
                features: [
                  'Track cost basis using FIFO or LIFO',
                  'See unrealized vs. realized profits',
                  'Understand the real value of your crypto holdings',
                ],
              },
              {
                icon: <DollarSign className="h-5 w-5" />,
                title: 'Income + Capital Gains',
                features: [
                  'Identify income events (payments, staking rewards)',
                  'Auto-convert to fiat (USD, INR, EUR)',
                  'Short-term vs. long-term tax treatment',
                ],
              },
              {
                icon: <FileText className="h-5 w-5" />,
                title: 'Tax-Ready Reports',
                features: [
                  'Download reports by quarter or year',
                  'Share with accountant or import into tax tools',
                  'Complete transaction and cost basis summaries',
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
    <section id="how-it-works" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-900">
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            No setup. No spreadsheets. Just clean books.
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-10 [counter-reset:steps] sm:mt-16 lg:mt-20 lg:max-w-5xl lg:grid-cols-4">
          {[
            {
              title: 'Connect your wallets',
              description: 'Easily connect your MetaMask, Gnosis Safe, or hardware wallets with a few clicks',
              icon: <Wallet className="h-5 w-5" />,
            },
            {
              title: 'Sync your transactions',
              description: 'We automatically fetch and organize all your on-chain transactions across networks',
              icon: <RefreshCw className="h-5 w-5" />,
            },
            {
              title: 'Tag & categorize',
              description: 'Label transactions with custom tags or let our smart rules handle it automatically',
              icon: <Tags className="h-5 w-5" />,
            },
            {
              title: 'View dashboards and export reports',
              description: 'Get instant insights from your dashboard or download detailed reports for accounting',
              icon: <BarChart3 className="h-5 w-5" />,
            },
          ].map((step, index) => (
            <li key={index} className="flex-start group relative flex [counter-increment:steps] lg:flex-col">
              {index < 3 && (
                <span
                  className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-200 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                  aria-hidden="true"
                />
              )}

              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200 group-hover:border-gray-900 group-hover:bg-gray-900">
                <div className="text-gray-600 group-hover:text-white">{step.icon}</div>
              </div>

              <div className="ml-6 lg:ml-0 lg:mt-10">
                <h3 className="text-lg font-semibold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 before:content-[counter(steps,decimal-leading-zero)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-base text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ul>
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

export const LandingScreen = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="h-full overflow-x-hidden font-sans antialiased">
          <Hero />

          <WhoIsItFor />
          <Features />
          <HowItWorks />

          <ReadyToSimplify />
        </div>
      </main>
      <Footer />
    </div>
  );
};
