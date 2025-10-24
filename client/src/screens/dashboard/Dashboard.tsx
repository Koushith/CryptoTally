import { ArrowUpRight, ArrowDownLeft, Info, X } from 'lucide-react';
import { useState } from 'react';

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
                  <span className="font-medium">UI Preview Mode</span> — Monochrome colors will be refined based on feedback.{' '}
                  <a href="https://www.cryptotally.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
                    Join waitlist
                  </a>
                  {' • '}
                  <a href="https://www.cryptotally.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
                    Request features
                  </a>
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

        {/* Total Balance Card */}
        <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm md:shadow-none mb-5 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Balance</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">$168,350</h2>
              <p className="text-sm text-gray-500">Across 4 wallets</p>
            </div>
            <div className="flex gap-6 md:gap-8">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Inflow</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">$245,150</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Outflow</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">$76,800</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-5 shadow-sm md:shadow-none">
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">234</p>
              <p className="text-xs text-gray-500 mt-1">transactions</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-5 shadow-sm md:shadow-none">
              <p className="text-sm text-gray-500 mb-1">Average Transaction</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">$1,375</p>
              <p className="text-xs text-gray-500 mt-1">per transaction</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-5 shadow-sm md:shadow-none">
              <p className="text-sm text-gray-500 mb-1">Net Flow</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">+$168,350</p>
              <p className="text-xs text-gray-500 mt-1">positive</p>
            </div>
          </div>
        </div>

        {/* By Category */}
        <div className="mb-8 md:mb-16">
          <div className="mb-4 md:mb-8">
            <h2 className="text-lg font-semibold text-gray-800">By Category</h2>
            <p className="text-sm text-gray-500 mt-1">Transaction breakdown by tags</p>
          </div>
          <div className="space-y-3">
            {[
              { tag: 'Customer Payment', amount: '$158,250', count: 42, type: 'in' as const },
              { tag: 'Grant', amount: '$62,400', count: 8, type: 'in' as const },
              { tag: 'Vendor Expense', amount: '$42,150', count: 28, type: 'out' as const },
              { tag: 'Salary', amount: '$28,900', count: 12, type: 'out' as const },
              { tag: 'Gas Fees', amount: '$5,750', count: 156, type: 'out' as const },
            ].map((item) => (
              <div
                key={item.tag}
                className="flex items-center justify-between bg-white border border-gray-200 md:hover:shadow-md rounded-2xl md:rounded-xl p-4 shadow-sm md:shadow-none active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                  }`}>
                    {item.type === 'in' ? (
                      <ArrowDownLeft className="h-5 w-5 text-gray-900" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{item.tag}</h3>
                    <p className="text-xs text-gray-500">{item.count} transactions</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800">{item.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="mb-4 md:mb-8">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <p className="text-sm text-gray-500 mt-1">Latest transactions across all wallets</p>
          </div>
          <div className="space-y-3">
            {[
              { amount: '5,000', token: 'USDC', tag: 'Customer Payment', time: '2h ago', wallet: 'Treasury', type: 'in' as const },
              { amount: '2.5', token: 'ETH', tag: 'Vendor Expense', time: '5h ago', wallet: 'Operations', type: 'out' as const },
              { amount: '10,000', token: 'USDT', tag: 'Grant', time: '1d ago', wallet: 'Treasury', type: 'in' as const },
              { amount: '1,500', token: 'USDC', tag: 'Salary', time: '2d ago', wallet: 'Payroll', type: 'out' as const },
              { amount: '7,500', token: 'DAI', tag: 'Customer Payment', time: '3d ago', wallet: 'Treasury', type: 'in' as const },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-gray-200 md:hover:shadow-md rounded-2xl md:rounded-xl p-4 shadow-sm md:shadow-none active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                  }`}>
                    {tx.type === 'in' ? (
                      <ArrowDownLeft className="h-5 w-5 text-gray-900" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
                      {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                    </h3>
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
  );
};
