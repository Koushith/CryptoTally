import { Button } from '@/components/ui/button';
import { Plus, Copy, ExternalLink, Wallet, TrendingUp, Activity } from 'lucide-react';

const mockWallets = [
  {
    id: '1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
    chainColor: 'bg-blue-500',
    balance: '$125,430.50',
    balanceNum: 125430.50,
    transactions: 342,
    change: '+12.5%',
  },
  {
    id: '2',
    label: 'Payroll Wallet',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    chain: 'Polygon',
    chainColor: 'bg-purple-500',
    balance: '$45,230.00',
    balanceNum: 45230.00,
    transactions: 128,
    change: '+8.2%',
  },
  {
    id: '3',
    label: 'Operations',
    address: '0x4f3a120E72C76c22ae802D129F599BFDbc31cb81',
    chain: 'Arbitrum',
    chainColor: 'bg-cyan-500',
    balance: '$28,150.75',
    balanceNum: 28150.75,
    transactions: 89,
    change: '+5.1%',
  },
  {
    id: '4',
    label: 'Marketing Budget',
    address: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
    chain: 'BNB Chain',
    chainColor: 'bg-yellow-500',
    balance: '$15,890.20',
    balanceNum: 15890.20,
    transactions: 56,
    change: '+3.7%',
  },
];

export const WalletsPage = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalBalance = mockWallets.reduce((acc, wallet) => acc + wallet.balanceNum, 0);
  const totalTransactions = mockWallets.reduce((acc, wallet) => acc + wallet.transactions, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Wallets</h1>
            <p className="text-gray-500 text-sm mt-2">Manage your connected wallets across multiple chains</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-xs text-white/70">{mockWallets.length} wallets</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-white/70">Total Balance</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Activity className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalTransactions}</div>
            <div className="text-sm text-gray-500">Total Transactions</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-xs text-green-600 font-medium">+7.8%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$18.2K</div>
            <div className="text-sm text-gray-500">30-day Change</div>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="group border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all duration-200 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{wallet.label}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${wallet.chainColor}`}></div>
                      <span className="text-xs text-gray-500">{wallet.chain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">{wallet.balance}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">{wallet.change}</span>
                  <span className="text-sm text-gray-400">vs last month</span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-gray-600 font-mono">
                    {wallet.address.slice(0, 12)}...{wallet.address.slice(-10)}
                  </code>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(wallet.address);
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Copy address"
                    >
                      <Copy className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{wallet.transactions} transactions</span>
                </div>
                <button className="text-sm text-gray-900 font-medium hover:underline">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
