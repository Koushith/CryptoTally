import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Banner } from '@/components/shared/Banner';
import { StatCard } from '@/components/shared/StatCard';
import { ActionCard } from '@/components/shared/ActionCard';
import { InfoCard, InfoRow } from '@/components/shared/InfoCard';

export const DashboardPage = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Preview Banner */}
        {showBanner && (
          <Banner
            title="UI Preview"
            message={
              <>
                This is how the app will look. Design and features are still in development.{' '}
                <Link to="/waitlist" className="underline hover:text-gray-300">
                  Join waitlist
                </Link>
                {' • '}
                <Link to="/feedback" className="underline hover:text-gray-300">
                  Share feedback
                </Link>
              </>
            }
            onClose={() => setShowBanner(false)}
            variant="info"
          />
        )}

        {/* Header */}
        <PageHeader title="Dashboard" description="Track your crypto transactions across all wallets" />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Key Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card - Hero */}
            <StatCard
              icon={Wallet}
              label="Total Balance"
              value="$168,350"
              subvalue="4 wallets • 3 chains"
              variant="hero"
            />

            {/* Income & Expenses */}
            <div className="grid grid-cols-2 gap-6">
              <StatCard
                icon={TrendingUp}
                iconBgColor="bg-green-50"
                iconColor="text-green-600"
                label="Income"
                sublabel="This Month"
                value="$24,500"
                subvalue="18 transactions"
              />
              <StatCard
                icon={TrendingDown}
                iconBgColor="bg-red-50"
                iconColor="text-red-600"
                label="Expenses"
                sublabel="This Month"
                value="$8,200"
                subvalue="12 transactions"
              />
            </div>

            {/* YTD Summary */}
            <InfoCard title="Year-to-Date">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Income</p>
                  <p className="text-2xl font-bold text-gray-900">$245,150</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">$76,800</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Net Income</p>
                  <p className="text-2xl font-bold text-green-600">$168,350</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">342</p>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Right Column - Action Items */}
          <div className="space-y-6">
            {/* Untagged Alert */}
            <ActionCard
              icon={AlertCircle}
              title="Action Required"
              description="You have untagged transactions"
              value="23"
              valueLabel="need categorization"
              actionLabel="Tag Transactions"
              actionHref="/transactions"
              variant="warning"
            />

            {/* Quick Stats */}
            <InfoCard title="Quick Stats">
              <div className="space-y-4">
                <InfoRow label="Tagged" value="319 (93%)" />
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '93%' }}></div>
                </div>
                <div className="pt-2">
                  <InfoRow label="Most Used Tag" value="Customer Payment" />
                </div>
                <InfoRow label="Active Wallets" value="4" />
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <p className="text-sm text-gray-500 mt-1">Latest activity across all wallets</p>
            </div>
            <Link
              to="/transactions"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            {[
              {
                amount: '5,000',
                token: 'USDC',
                tag: 'Customer Payment',
                time: '2h ago',
                wallet: 'Treasury',
                chain: 'Ethereum',
                type: 'in' as const,
                tagged: true,
              },
              {
                amount: '2.5',
                token: 'ETH',
                tag: 'Vendor Payment',
                time: '5h ago',
                wallet: 'Operations',
                chain: 'Ethereum',
                type: 'out' as const,
                tagged: true,
              },
              {
                amount: '10,000',
                token: 'USDT',
                tag: null,
                time: '1d ago',
                wallet: 'Treasury',
                chain: 'Polygon',
                type: 'in' as const,
                tagged: false,
              },
              {
                amount: '1,500',
                token: 'USDC',
                tag: 'Salary Payment',
                time: '2d ago',
                wallet: 'Payroll',
                chain: 'Arbitrum',
                type: 'out' as const,
                tagged: true,
              },
              {
                amount: '7,500',
                token: 'DAI',
                tag: 'Customer Payment',
                time: '3d ago',
                wallet: 'Treasury',
                chain: 'Ethereum',
                type: 'in' as const,
                tagged: true,
              },
            ].map((tx, idx) => (
              <div key={idx} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      tx.type === 'in' ? 'bg-green-50 group-hover:bg-green-100' : 'bg-red-50 group-hover:bg-red-100'
                    }`}
                  >
                    {tx.type === 'in' ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'in' ? '+' : '−'}
                        {tx.amount} {tx.token}
                      </span>
                      {!tx.tagged && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-semibold">
                          Untagged
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{tx.wallet}</span>
                      <span>•</span>
                      <span>{tx.chain}</span>
                      {tx.tag && (
                        <>
                          <span>•</span>
                          <span className="text-gray-700">{tx.tag}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-500">{tx.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
