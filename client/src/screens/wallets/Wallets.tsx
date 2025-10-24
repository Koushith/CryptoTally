import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, TrendingUp, Activity, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const chainLogos: Record<string, JSX.Element> = {
  Ethereum: (
    <svg viewBox="0 0 256 417" className="w-6 h-6">
      <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
      <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
      <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
      <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
      <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
      <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
    </svg>
  ),
  Polygon: (
    <svg viewBox="0 0 38.4 33.5" className="w-6 h-6">
      <path fill="#8247E5" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
    </svg>
  ),
  Arbitrum: (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <path fill="#28A0F0" d="M24.4 8.9l-7.7 13.3-1.6 2.8-5-8.6 3.3-5.8 2.7-4.6 4.1 7.1 1.3 2.3 2.9-6.5z"/>
      <path fill="#96BEDC" d="M11.1 15.5l-2.7 4.7-1.5 2.6 7.9 1.3 5.8-1-2.7-4.7z"/>
      <path fill="#213147" d="M24.3 8.9l-4-7c-.3-.6-1-.9-1.6-.9H13.2c-.7 0-1.3.4-1.6.9l-7.7 13.4c-.3.6-.3 1.3 0 1.9l4 7c.3.6 1 .9 1.6.9h11.1c.7 0 1.3-.4 1.6-.9l7.7-13.4c.3-.6.3-1.3 0-1.9z"/>
      <path fill="#12AAFF" d="M19.3 12.1l-2.7-4.7-4.1 7.1 2.7 4.7z"/>
      <path fill="#9DCCED" d="M19.3 12.1l-2.7 4.7h5.4z"/>
    </svg>
  ),
  'BNB Chain': (
    <svg viewBox="0 0 126.61 126.61" className="w-6 h-6">
      <path fill="#F3BA2F" d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.43 38.89l14.3 14.31zM0 63.31l14.3-14.3 14.31 14.3-14.31 14.3L0 63.31zm38.73 10.11l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88-.01-.01 14.32-14.3zm48.9-10.12l14.31-14.3 14.3 14.3-14.3 14.3-14.31-14.3z"/>
      <path fill="#F3BA2F" d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47v-.01z"/>
    </svg>
  ),
};

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
        <div className="mb-8 md:mb-16 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Wallets</h1>
            <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your connected wallets across multiple chains</p>
          </div>
          <Button onClick={() => setIsAddWalletOpen(true)} className="flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Wallets Grid */}
        <div className="mb-8 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {mockWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="group bg-white rounded-2xl md:rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm md:shadow-none md:hover:shadow-md active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                    {chainLogos[wallet.chain]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{wallet.label}</h3>
                    <p className="text-xs text-gray-500">{wallet.chain}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="text-3xl font-bold text-gray-800">{wallet.balance}</div>
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

        {/* Add Wallet Dialog */}
        <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Wallet</DialogTitle>
              <DialogDescription>
                Connect a wallet to track transactions across multiple chains
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
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

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsAddWalletOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWallet}>
                Add Wallet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
