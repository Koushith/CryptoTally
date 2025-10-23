import { Button } from '@/components/ui/button';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-2">Quick overview of your accounting</p>
        </div>

        {/* Summary - Single Row */}
        <div className="mb-16">
          <div className="grid grid-cols-3 gap-px bg-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white p-8">
              <div className="text-xs uppercase font-semibold tracking-wider text-gray-500 mb-3">Balance</div>
              <div className="text-4xl font-bold text-gray-900">$168,350</div>
            </div>
            <div className="bg-white p-8">
              <div className="text-xs uppercase font-semibold tracking-wider text-gray-500 mb-3">Inflow</div>
              <div className="text-4xl font-bold text-gray-900">$245,150</div>
            </div>
            <div className="bg-white p-8">
              <div className="text-xs uppercase font-semibold tracking-wider text-gray-500 mb-3">Outflow</div>
              <div className="text-4xl font-bold text-gray-900">$76,800</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Category Breakdown */}
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-6">By Category</h2>
            <div className="space-y-1">
              {[
                { tag: 'Customer Payment', amount: '$158,250', type: 'in' },
                { tag: 'Grant', amount: '$62,400', type: 'in' },
                { tag: 'Vendor Expense', amount: '$42,150', type: 'out' },
                { tag: 'Salary', amount: '$28,900', type: 'out' },
                { tag: 'Gas Fees', amount: '$5,750', type: 'out' },
              ].map((item) => (
                <div key={item.tag} className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 px-2 -mx-2">
                  <span className="text-sm text-gray-700">{item.tag}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-xs font-medium">View All →</Button>
            </div>
            <div className="space-y-1">
              {[
                { amount: '+ 5,000 USDC', tag: 'Customer Payment', time: '2h ago' },
                { amount: '− 2.5 ETH', tag: 'Vendor Expense', time: '5h ago' },
                { amount: '+ 10,000 USDT', tag: 'Grant', time: '1d ago' },
                { amount: '− 1,500 USDC', tag: 'Salary', time: '2d ago' },
                { amount: '+ 7,500 DAI', tag: 'Customer Payment', time: '3d ago' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer px-2 -mx-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">{tx.amount}</div>
                    <div className="text-xs text-gray-500">{tx.tag}</div>
                  </div>
                  <div className="text-xs text-gray-400">{tx.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
