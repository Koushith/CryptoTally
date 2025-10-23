import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Copy, ExternalLink, Wallet } from 'lucide-react';

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
    balanceNum: 15890.2,
    transactions: 56,
    change: '+3.7%',
  },
];

export const WalletsPage = () => {
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalBalance = mockWallets.reduce((acc, wallet) => acc + wallet.balanceNum, 0);
  const totalTransactions = mockWallets.reduce((acc, wallet) => acc + wallet.transactions, 0);

  const handleAddWallet = () => {
    // Handle adding wallet logic here
    console.log({ walletAddress, walletLabel, selectedChain });
    setIsAddWalletOpen(false);
    setWalletAddress('');
    setWalletLabel('');
    setSelectedChain('ethereum');
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-4 mb-5 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-gray-900">Wallets</h1>
            <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your connected wallets across multiple chains</p>
          </div>
          <Button onClick={() => setIsAddWalletOpen(true)} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="bg-white md:bg-gray-50 rounded-2xl md:rounded-xl p-5 md:p-6 mb-5 md:mb-10 shadow-sm md:shadow-none">
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

        {/* Wallets List */}
        <div className="space-y-3 md:space-y-4">
          {mockWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="group bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-5 shadow-sm md:shadow-none active:scale-[0.98] md:hover:border-gray-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Wallet Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">{wallet.label}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${wallet.chainColor}`}></div>
                        <span className="text-xs text-gray-500">{wallet.chain}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="text-xs text-gray-500 font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(wallet.address);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy address"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View on explorer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center: Stats */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="text-lg font-bold text-gray-900">{wallet.balance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Transactions</div>
                    <div className="text-lg font-semibold text-gray-900">{wallet.transactions}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Change</div>
                    <div className="text-lg font-semibold text-green-600">{wallet.change}</div>
                  </div>
                </div>

                {/* Right: Action */}
                <button className="opacity-0 group-hover:opacity-100 text-sm text-gray-600 hover:text-gray-900 font-medium transition-opacity">
                  View →
                </button>
              </div>

              {/* Mobile Stats */}
              <div className="md:hidden mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Balance</div>
                  <div className="text-sm font-bold text-gray-900">{wallet.balance}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Transactions</div>
                  <div className="text-sm font-semibold text-gray-900">{wallet.transactions}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Change</div>
                  <div className="text-sm font-semibold text-green-600">{wallet.change}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Wallet Modal */}
        <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Wallet</DialogTitle>
              <DialogDescription>Connect a wallet to track transactions across multiple chains</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-label">Wallet Label</Label>
                <Input
                  id="wallet-label"
                  placeholder="e.g., Treasury Wallet"
                  value={walletLabel}
                  onChange={(e) => setWalletLabel(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chain">Blockchain Network</Label>
                <select
                  id="chain"
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
                  <strong>Note:</strong> This is a read-only connection. We'll never ask for your private keys or seed
                  phrase.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddWalletOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWallet}>Add Wallet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
