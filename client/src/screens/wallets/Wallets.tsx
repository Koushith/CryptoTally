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
import { Plus, Copy, ExternalLink, Wallet, TrendingUp, Activity } from 'lucide-react';

const mockWallets = [
  {
    id: '1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
    chainColor: 'bg-blue-500',
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
    chainColor: 'bg-purple-500',
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
    chainColor: 'bg-cyan-500',
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
    chainColor: 'bg-yellow-500',
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
        <div className="mb-5 md:mb-10">
          <h1 className="text-2xl md:text-[32px] font-bold text-gray-900">Wallets</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your connected wallets across multiple chains</p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white md:bg-gray-50 rounded-2xl md:rounded-xl p-5 md:p-6 mb-5 md:mb-8 shadow-sm md:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-2">Total Balance</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-500">{mockWallets.length} wallets connected</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Total Transactions</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{totalTransactions}</div>
              <div className="text-xs text-green-600">All time</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">30-day Change</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">$18.2K</div>
              <div className="text-xs text-green-600">+7.8% vs last month</div>
            </div>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Your Wallets</h2>
            <Button onClick={() => setIsAddWalletOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Wallet
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {mockWallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletClick(wallet.id)}
                className="group bg-white border border-gray-200 rounded-2xl md:rounded-xl p-5 md:p-6 shadow-sm md:shadow-none active:scale-[0.98] md:hover:shadow-md md:hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{wallet.label}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${wallet.chainColor}`}></div>
                        <span className="text-xs text-gray-500">{wallet.chain}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="text-2xl font-bold text-gray-900">{wallet.balance}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600">{wallet.transactions} txs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{wallet.change}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <code className="text-xs text-gray-400 font-mono">
                      {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                    </code>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Wallet Sheet */}
        <Sheet open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
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

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> This is a read-only connection. We'll never ask for your private keys or seed phrase.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsAddWalletOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWallet}>Add Wallet</Button>
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
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <SheetTitle>{selectedWalletData.label}</SheetTitle>
                    </div>
                  </div>
                  <SheetDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${selectedWalletData.chainColor}`}></div>
                      <span>{selectedWalletData.chain}</span>
                    </div>
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Balance */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-2">Total Balance</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{selectedWalletData.balance}</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{selectedWalletData.change}</span>
                      <span className="text-xs text-gray-500">last 30 days</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Wallet Address</Label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                      <code className="text-xs text-gray-900 font-mono flex-1 break-all">
                        {selectedWalletData.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedWalletData.address)}
                        className="flex-shrink-0"
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button
                        className="flex-shrink-0"
                        title="View on explorer"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">Transactions</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedWalletData.transactions}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">Network</div>
                      <div className="text-sm font-semibold text-gray-900">{selectedWalletData.chain}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      View Transactions
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
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
