import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Plus, Copy, ExternalLink, Wallet, TrendingUp, Activity, MoreVertical } from 'lucide-react';

const mockWallets = [
  {
    id: '1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
    chainColor: 'bg-blue-100',
    chainTextColor: 'text-blue-700',
    chainIcon: '⟠',
    balance: '$125,430.50',
    balanceNum: 125430.5,
    transactions: 342,
    change: '+12.5%',
    changePositive: true,
  },
  {
    id: '2',
    label: 'Payroll Wallet',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    chain: 'Polygon',
    chainColor: 'bg-purple-100',
    chainTextColor: 'text-purple-700',
    chainIcon: '⬡',
    balance: '$45,230.00',
    balanceNum: 45230.0,
    transactions: 128,
    change: '+8.2%',
    changePositive: true,
  },
  {
    id: '3',
    label: 'Operations',
    address: '0x4f3a120E72C76c22ae802D129F599BFDbc31cb81',
    chain: 'Arbitrum',
    chainColor: 'bg-cyan-100',
    chainTextColor: 'text-cyan-700',
    chainIcon: '◆',
    balance: '$28,150.75',
    balanceNum: 28150.75,
    transactions: 89,
    change: '+5.1%',
    changePositive: true,
  },
  {
    id: '4',
    label: 'Marketing Budget',
    address: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
    chain: 'BNB Chain',
    chainColor: 'bg-yellow-100',
    chainTextColor: 'text-yellow-700',
    chainIcon: '◈',
    balance: '$15,890.20',
    balanceNum: 15890.2,
    transactions: 56,
    change: '+3.7%',
    changePositive: true,
  },
];

export const WalletsPage = () => {
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalBalance = mockWallets.reduce((acc, wallet) => acc + wallet.balanceNum, 0);
  const totalTransactions = mockWallets.reduce((acc, wallet) => acc + wallet.transactions, 0);

  const handleAddWallet = () => {
    console.log({ walletAddress, walletLabel, selectedChain });
    setIsAddWalletOpen(false);
    setWalletAddress('');
    setWalletLabel('');
    setSelectedChain('ethereum');
  };

  const handleWalletClick = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  const selectedWalletData = mockWallets.find(w => w.id === selectedWallet);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-gray-900">Wallets</h1>
            <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your connected wallets across multiple chains</p>
          </div>
          <Button
            onClick={() => setIsAddWalletOpen(true)}
            className="hidden md:flex"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Stats Overview - Horizontal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 shadow-sm md:shadow-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">Total Balance</div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500 mt-2">{mockWallets.length} wallets connected</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 shadow-sm md:shadow-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">Transactions</div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalTransactions}</div>
            <div className="text-xs text-gray-500 mt-2">All time</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 shadow-sm md:shadow-none sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">30-day Growth</div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">$18.2K</div>
            <div className="text-xs text-green-600 mt-2 font-medium">+7.8% vs last month</div>
          </div>
        </div>

        {/* Mobile Add Button */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setIsAddWalletOpen(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Wallet
          </Button>
        </div>

        {/* Wallets List */}
        <div className="space-y-3">
          {mockWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id)}
              className="group w-full bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 md:p-6 shadow-sm md:shadow-none active:scale-[0.99] md:hover:shadow-md md:hover:border-gray-300 transition-all text-left"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Icon + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl ${wallet.chainColor} flex items-center justify-center flex-shrink-0 text-2xl`}>
                    {wallet.chainIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{wallet.label}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-medium ${wallet.chainTextColor}`}>{wallet.chain}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <code className="text-xs text-gray-500 font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Right: Balance + Stats */}
                <div className="hidden md:flex items-center gap-8">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="text-xl font-bold text-gray-900">{wallet.balance}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Activity</div>
                    <div className="text-sm text-gray-600">{wallet.transactions} txs</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Change</div>
                    <div className="text-sm font-medium text-green-600">{wallet.change}</div>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Balance</div>
                  <div className="text-lg font-bold text-gray-900">{wallet.balance}</div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-gray-600">{wallet.transactions} txs</div>
                  <div className="font-medium text-green-600">{wallet.change}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Add Wallet Sheet */}
        <Sheet open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <SheetTitle>Add New Wallet</SheetTitle>
                </div>
              </div>
              <SheetDescription>Connect a wallet to track transactions across multiple chains</SheetDescription>
            </SheetHeader>

            <div className="space-y-5 mt-6">
              <div className="space-y-2">
                <Label htmlFor="wallet-label" className="text-sm text-gray-700">Wallet Label</Label>
                <Input
                  id="wallet-label"
                  placeholder="e.g., Treasury Wallet"
                  value={walletLabel}
                  onChange={(e) => setWalletLabel(e.target.value)}
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-address" className="text-sm text-gray-700">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono text-sm border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chain" className="text-sm text-gray-700">Blockchain Network</Label>
                <select
                  id="chain"
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="bnb">BNB Chain</option>
                  <option value="base">Base</option>
                  <option value="optimism">Optimism</option>
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-900">
                  <strong className="font-semibold">Secure Connection:</strong> This is read-only. We'll never ask for private keys.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddWalletOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddWallet} className="flex-1">Add Wallet</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Wallet Details Sheet */}
        <Sheet open={!!selectedWallet} onOpenChange={() => setSelectedWallet(null)}>
          <SheetContent className="overflow-y-auto">
            {selectedWalletData && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl ${selectedWalletData.chainColor} flex items-center justify-center text-2xl`}>
                      {selectedWalletData.chainIcon}
                    </div>
                    <div>
                      <SheetTitle>{selectedWalletData.label}</SheetTitle>
                      <span className={`text-sm font-medium ${selectedWalletData.chainTextColor}`}>
                        {selectedWalletData.chain}
                      </span>
                    </div>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Current Balance</div>
                    <div className="text-3xl font-bold text-gray-900 mb-3">{selectedWalletData.balance}</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-semibold">{selectedWalletData.change}</span>
                      <span className="text-xs text-gray-500">last 30 days</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Wallet Address</Label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <code className="text-xs text-gray-900 font-mono flex-1 break-all">
                        {selectedWalletData.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedWalletData.address)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="View on explorer"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1 font-medium">Total Transactions</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedWalletData.transactions}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1 font-medium">Network</div>
                      <div className="text-base font-semibold text-gray-900 mt-1">{selectedWalletData.chain}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Activity className="h-4 w-4 mr-2" />
                      View All Transactions
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      size="lg"
                    >
                      Remove Wallet
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
