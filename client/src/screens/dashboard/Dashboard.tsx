import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Receipt,
  Gift,
  Banknote,
  Fuel,
  Clock,
} from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-2">Overview of your crypto accounting</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Balance Card - Dark gradient like Wallets page */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-xs text-white/70">4 wallets</span>
            </div>
            <div className="text-3xl font-bold mb-1">$168,350</div>
            <div className="text-sm text-white/70">Total Balance</div>
          </div>

          {/* Inflow Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-xs text-green-600 font-medium">+12.5%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$245,150</div>
            <div className="text-sm text-gray-500">Total Inflow</div>
          </div>

          {/* Outflow Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-xs text-gray-500 font-medium">89 txns</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$76,800</div>
            <div className="text-sm text-gray-500">Total Outflow</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Category Breakdown */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">By Category</h2>
            <div className="space-y-3">
              {[
                {
                  tag: 'Customer Payment',
                  amount: '$158,250',
                  type: 'in',
                  icon: DollarSign,
                  color: 'bg-green-100',
                  iconColor: 'text-green-700',
                },
                {
                  tag: 'Grant',
                  amount: '$62,400',
                  type: 'in',
                  icon: Gift,
                  color: 'bg-blue-100',
                  iconColor: 'text-blue-700',
                },
                {
                  tag: 'Vendor Expense',
                  amount: '$42,150',
                  type: 'out',
                  icon: Receipt,
                  color: 'bg-orange-100',
                  iconColor: 'text-orange-700',
                },
                {
                  tag: 'Salary',
                  amount: '$28,900',
                  type: 'out',
                  icon: Banknote,
                  color: 'bg-purple-100',
                  iconColor: 'text-purple-700',
                },
                {
                  tag: 'Gas Fees',
                  amount: '$5,750',
                  type: 'out',
                  icon: Fuel,
                  color: 'bg-gray-100',
                  iconColor: 'text-gray-700',
                },
              ].map((item) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.tag}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Recent Transactions */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-gray-900 font-medium hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {[
                { amount: '5,000', token: 'USDC', tag: 'Customer Payment', time: '2h ago', type: 'in' },
                { amount: '2.5', token: 'ETH', tag: 'Vendor Expense', time: '5h ago', type: 'out' },
                { amount: '10,000', token: 'USDT', tag: 'Grant', time: '1d ago', type: 'in' },
                { amount: '1,500', token: 'USDC', tag: 'Salary', time: '2d ago', type: 'out' },
                { amount: '7,500', token: 'DAI', tag: 'Customer Payment', time: '3d ago', type: 'in' },
              ].map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'in' ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-700" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-700" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                      </div>
                      <div className="text-xs text-gray-500">{tx.tag}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
