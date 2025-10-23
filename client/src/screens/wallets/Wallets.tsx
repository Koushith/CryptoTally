import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Copy, ExternalLink, TrendingUp, Activity, ChevronDown } from 'lucide-react';

const mockWallets = [
  {
    id: '1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
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

  const handleAddWallet = () => {
    console.log({ walletAddress, walletLabel, selectedChain });
    setIsAddWalletOpen(false);
    setWalletAddress('');
    setWalletLabel('');
    setSelectedChain('ethereum');
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <h1 className="text-2xl md:text-[32px] font-bold text-gray-800">Wallets</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your connected wallets across multiple chains</p>
        </div>

        {/* Wallets Grid */}
        <div className="mb-8 md:mb-16">
          <div className="mb-4 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Your Wallets</h2>
            <p className="text-sm text-gray-500 mt-1">Connected wallets across multiple chains</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {mockWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="group bg-white rounded-2xl md:rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm md:shadow-none md:hover:shadow-md active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{wallet.label}</h3>
                    <p className="text-xs text-gray-500">{wallet.chain}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
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
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <code className="text-xs text-gray-400 font-mono truncate flex-1">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </code>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(wallet.address);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="Copy address"
                    >
                      <Copy className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Wallet Form */}
        <div className="mb-8 md:mb-16">
          <button
            onClick={() => setIsAddWalletOpen(!isAddWalletOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 md:hover:border-gray-300 rounded-2xl md:rounded-xl p-4 md:p-5 shadow-sm md:shadow-none active:scale-[0.99] transition-all mb-4"
          >
            <div className="text-left">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Add New Wallet</h2>
              <p className="text-sm text-gray-500 mt-1">Connect a wallet to track transactions</p>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isAddWalletOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isAddWalletOpen && (
            <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm md:shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-label" className="text-sm font-medium text-gray-700">
                      Wallet Label
                    </Label>
                    <Input
                      id="wallet-label"
                      placeholder="e.g., Treasury Wallet"
                      value={walletLabel}
                      onChange={(e) => setWalletLabel(e.target.value)}
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet-address" className="text-sm font-medium text-gray-700">
                      Wallet Address
                    </Label>
                    <Input
                      id="wallet-address"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="font-mono text-sm border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="chain" className="text-sm font-medium text-gray-700">
                      Blockchain Network
                    </Label>
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
                      <strong>Note:</strong> This is read-only. We'll never ask for private keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-5 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Connect your wallet to start tracking transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => setIsAddWalletOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddWallet}>
                    Add Wallet
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
