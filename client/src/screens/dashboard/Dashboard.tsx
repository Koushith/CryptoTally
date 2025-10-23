import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Overview of your crypto accounting</p>
        </div>

        {/* Summary Stats - Single Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <div className="text-xs text-gray-600 mb-2">Total Balance</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$168,350</div>
              <div className="text-xs text-gray-500">Across 4 wallets</div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-2">Total Inflow</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$245,150</div>
              <div className="text-xs text-gray-600">+12.5% vs last month</div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-2">Total Outflow</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$76,800</div>
              <div className="text-xs text-gray-500">89 transactions</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Category</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200">
            {[
              { tag: 'Customer Payment', amount: '$158,250', count: 42, type: 'in' as const },
              { tag: 'Grant', amount: '$62,400', count: 8, type: 'in' as const },
              { tag: 'Vendor Expense', amount: '$42,150', count: 28, type: 'out' as const },
              { tag: 'Salary', amount: '$28,900', count: 12, type: 'out' as const },
              { tag: 'Gas Fees', amount: '$5,750', count: 156, type: 'out' as const },
            ].map((item) => (
              <div
                key={item.tag}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                  }`}>
                    {item.type === 'in' ? (
                      <ArrowDownLeft className="h-5 w-5 text-gray-900" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.tag}</div>
                    <div className="text-xs text-gray-500">{item.count} transactions</div>
                  </div>
                </div>
                <div className="text-base font-bold text-gray-900">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              View All →
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200">
            {[
              { amount: '5,000', token: 'USDC', tag: 'Customer Payment', time: '2h ago', wallet: 'Treasury', type: 'in' as const },
              { amount: '2.5', token: 'ETH', tag: 'Vendor Expense', time: '5h ago', wallet: 'Operations', type: 'out' as const },
              { amount: '10,000', token: 'USDT', tag: 'Grant', time: '1d ago', wallet: 'Treasury', type: 'in' as const },
              { amount: '1,500', token: 'USDC', tag: 'Salary', time: '2d ago', wallet: 'Payroll', type: 'out' as const },
              { amount: '7,500', token: 'DAI', tag: 'Customer Payment', time: '3d ago', wallet: 'Treasury', type: 'in' as const },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                  }`}>
                    {tx.type === 'in' ? (
                      <ArrowDownLeft className="h-5 w-5 text-gray-900" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">
                      {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                    </div>
                    <div className="text-xs text-gray-600 truncate">{tx.tag} • {tx.wallet}</div>
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
