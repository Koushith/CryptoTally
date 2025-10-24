import { Info, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Preview Banner */}
        {showBanner && (
          <div className="bg-gray-900 text-white rounded-2xl md:rounded-xl p-3 md:p-4 mb-5 md:mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">
                  <span className="font-medium">UI Preview</span> — This is how the app will look. Design and features are still in development.{' '}
                  <a href="https://www.cryptotally.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
                    Join waitlist
                  </a>
                  {' • '}
                  <Link to="/feedback" className="underline hover:text-gray-300">
                    Share feedback
                  </Link>
                </p>
              </div>
              <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-white/10 rounded flex-shrink-0" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-5 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Overview of your crypto accounting</p>
        </div>

        {/* Balance Overview */}
        <div className="mb-8 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm md:shadow-none">
              <p className="text-sm text-gray-500 mb-2">Total Balance</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">$168,350</p>
              <p className="text-xs text-gray-500">Across 4 wallets</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm md:shadow-none">
              <p className="text-sm text-gray-500 mb-2">Total Inflow</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">$245,150</p>
              <p className="text-xs text-gray-500">+12.5% vs last month</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm md:shadow-none">
              <p className="text-sm text-gray-500 mb-2">Total Outflow</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">$76,800</p>
              <p className="text-xs text-gray-500">89 transactions</p>
            </div>
          </div>
        </div>

        {/* Activity Breakdown & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {/* Activity Breakdown */}
          <div>
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Activity Breakdown</h2>
              <p className="text-sm text-gray-500 mt-1">Transaction summary by type</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 md:p-6 shadow-sm md:shadow-none">
              <div className="space-y-4">
                {[
                  { tag: 'Customer Payments', amount: '$158,250', count: 42, type: 'in' as const },
                  { tag: 'Vendor Expenses', amount: '$42,150', count: 28, type: 'out' as const },
                  { tag: 'Salaries', amount: '$28,900', count: 12, type: 'out' as const },
                  { tag: 'Gas Fees', amount: '$5,750', count: 156, type: 'out' as const },
                ].map((item) => (
                  <div key={item.tag} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-2 h-2 rounded-full ${item.type === 'in' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.tag}</p>
                        <p className="text-xs text-gray-500">{item.count} transactions</p>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-gray-800">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="mb-4 md:mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <p className="text-sm text-gray-500 mt-1">Latest transactions</p>
              </div>
              <Link
                to="/transactions"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 md:p-6 shadow-sm md:shadow-none">
              <div className="space-y-4">
                {[
                  { amount: '5,000', token: 'USDC', tag: 'Customer Payment', time: '2h ago', wallet: 'Treasury', type: 'in' as const },
                  { amount: '2.5', token: 'ETH', tag: 'Vendor Expense', time: '5h ago', wallet: 'Operations', type: 'out' as const },
                  { amount: '10,000', token: 'USDT', tag: 'Grant', time: '1d ago', wallet: 'Treasury', type: 'in' as const },
                  { amount: '1,500', token: 'USDC', tag: 'Salary', time: '2d ago', wallet: 'Payroll', type: 'out' as const },
                ].map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${tx.type === 'in' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                        </p>
                        <p className="text-xs text-gray-500">{tx.tag} • {tx.wallet}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{tx.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
