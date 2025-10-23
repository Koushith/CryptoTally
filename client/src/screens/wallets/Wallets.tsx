import { Button } from '@/components/ui/button';
import { Plus, Copy, ExternalLink, Wallet } from 'lucide-react';

const mockWallets = [
  {
    id: '1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
    balance: '$125,430.50',
  },
  {
    id: '2',
    label: 'Payroll Wallet',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    chain: 'Polygon',
    balance: '$45,230.00',
  },
  {
    id: '3',
    label: 'Operations',
    address: '0x4f3a120E72C76c22ae802D129F599BFDbc31cb81',
    chain: 'Arbitrum',
    balance: '$28,150.75',
  },
  {
    id: '4',
    label: 'Marketing Budget',
    address: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
    chain: 'BNB Chain',
    balance: '$15,890.20',
  },
];

export const WalletsPage = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Wallets</h1>
            <p className="text-gray-500 text-sm mt-2">Manage your connected wallets</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Wallets List */}
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {mockWallets.map((wallet) => (
            <div key={wallet.id} className="p-6 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[15px] font-medium text-gray-900">{wallet.label}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {wallet.chain}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="text-xs text-gray-500 font-mono">
                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(wallet.address);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Copy className="h-3 w-3 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{wallet.balance}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
