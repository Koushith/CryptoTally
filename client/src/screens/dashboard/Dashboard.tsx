import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-white md:bg-white">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-5 md:mb-10">
          <h1 className="text-2xl md:text-[32px] font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Overview of your crypto accounting</p>
        </div>

        {/* Summary Cards */}
        <div className="bg-white md:bg-gray-50 rounded-2xl md:rounded-xl p-5 md:p-6 mb-5 md:mb-10 shadow-sm md:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-2">Total Balance</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">$168,350</div>
              <div className="text-xs text-gray-500">4 wallets connected</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Total Inflow</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">$245,150</div>
              <div className="text-xs text-green-600">+12.5% vs last month</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Total Outflow</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">$76,800</div>
              <div className="text-xs text-gray-500">89 transactions</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column - Category Breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 md:p-6 shadow-sm md:shadow-none">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-5">By Category</h2>
            <div className="space-y-2">
              {[
                { tag: 'Customer Payment', amount: '$158,250', type: 'in' },
                { tag: 'Grant', amount: '$62,400', type: 'in' },
                { tag: 'Vendor Expense', amount: '$42,150', type: 'out' },
                { tag: 'Salary', amount: '$28,900', type: 'out' },
                { tag: 'Gas Fees', amount: '$5,750', type: 'out' },
              ].map((item) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${item.type === 'in' ? 'bg-green-500' : 'bg-gray-400'}`}
                    ></div>
                    <span className="text-sm text-gray-800">{item.tag}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 md:p-6 shadow-sm md:shadow-none">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Activity</h2>
              <button className="text-xs md:text-sm text-gray-600 active:text-gray-800 md:hover:text-gray-800 font-medium">View All →</button>
            </div>
            <div className="space-y-2">
              {[
                { amount: '5,000', token: 'USDC', tag: 'Customer Payment', time: '2h ago', type: 'in' },
                { amount: '2.5', token: 'ETH', tag: 'Vendor Expense', time: '5h ago', type: 'out' },
                { amount: '10,000', token: 'USDT', tag: 'Grant', time: '1d ago', type: 'in' },
                { amount: '1,500', token: 'USDC', tag: 'Salary', time: '2d ago', type: 'out' },
                { amount: '7,500', token: 'DAI', tag: 'Customer Payment', time: '3d ago', type: 'in' },
              ].map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900">
                      {tx.type === 'in' ? (
                        <ArrowDownLeft className="h-4 w-4 text-white" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                      </div>
                      <div className="text-xs text-gray-500">{tx.tag}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{tx.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
