import { Info, X, ArrowRight, Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Preview Banner */}
        {showBanner && (
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-4 mb-8 shadow-lg">
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
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your crypto transactions across all wallets</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Key Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card - Hero */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Balance</span>
                </div>
                <p className="text-5xl font-bold mb-4">$168,350</p>
                <p className="text-gray-400">4 wallets • 3 chains</p>
              </div>
            </div>

            {/* Income & Expenses */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Income</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">$24,500</p>
                <p className="text-sm text-gray-500">18 transactions</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Expenses</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">$8,200</p>
                <p className="text-sm text-gray-500">12 transactions</p>
              </div>
            </div>

            {/* YTD Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Year-to-Date</h3>
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
            </div>
          </div>

          {/* Right Column - Action Items */}
          <div className="space-y-6">
            {/* Untagged Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Action Required</h3>
                  <p className="text-xs text-gray-600">You have untagged transactions</p>
                </div>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-orange-600">23</p>
                  <p className="text-xs text-gray-600">need categorization</p>
                </div>
              </div>
              <Link
                to="/transactions"
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2.5 rounded-lg font-medium transition-colors"
              >
                Tag Transactions
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tagged</span>
                  <span className="text-sm font-semibold text-gray-900">319 (93%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '93%' }}></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">Most Used Tag</span>
                  <span className="text-sm font-semibold text-gray-900">Customer Payment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Wallets</span>
                  <span className="text-sm font-semibold text-gray-900">4</span>
                </div>
              </div>
            </div>
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
              { amount: '5,000', token: 'USDC', tag: 'Customer Payment', time: '2h ago', wallet: 'Treasury', chain: 'Ethereum', type: 'in' as const, tagged: true },
              { amount: '2.5', token: 'ETH', tag: 'Vendor Payment', time: '5h ago', wallet: 'Operations', chain: 'Ethereum', type: 'out' as const, tagged: true },
              { amount: '10,000', token: 'USDT', tag: null, time: '1d ago', wallet: 'Treasury', chain: 'Polygon', type: 'in' as const, tagged: false },
              { amount: '1,500', token: 'USDC', tag: 'Salary Payment', time: '2d ago', wallet: 'Payroll', chain: 'Arbitrum', type: 'out' as const, tagged: true },
              { amount: '7,500', token: 'DAI', tag: 'Customer Payment', time: '3d ago', wallet: 'Treasury', chain: 'Ethereum', type: 'in' as const, tagged: true },
            ].map((tx, idx) => (
              <div key={idx} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    tx.type === 'in'
                      ? 'bg-green-50 group-hover:bg-green-100'
                      : 'bg-red-50 group-hover:bg-red-100'
                  }`}>
                    {tx.type === 'in' ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'in' ? '+' : '−'}{tx.amount} {tx.token}
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
