import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Copy,
  ExternalLink,
  Activity,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { WalletService, Wallet } from '@/services/wallet.service';
import { WalletBalanceService, WalletBalance } from '@/services/wallet-balance.service';
import { WorkspaceService } from '@/services/workspace.service';
import { toast } from 'sonner';

const chainLogos: Record<string, JSX.Element> = {
  Ethereum: (
    <svg viewBox="0 0 256 417" className="w-6 h-6">
      <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
      <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
      <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
      <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
      <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
      <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z" />
    </svg>
  ),
  Polygon: (
    <svg viewBox="0 0 38.4 33.5" className="w-6 h-6">
      <path
        fill="#8247E5"
        d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
      />
    </svg>
  ),
  Arbitrum: (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <path fill="#28A0F0" d="M24.4 8.9l-7.7 13.3-1.6 2.8-5-8.6 3.3-5.8 2.7-4.6 4.1 7.1 1.3 2.3 2.9-6.5z" />
      <path fill="#96BEDC" d="M11.1 15.5l-2.7 4.7-1.5 2.6 7.9 1.3 5.8-1-2.7-4.7z" />
      <path
        fill="#213147"
        d="M24.3 8.9l-4-7c-.3-.6-1-.9-1.6-.9H13.2c-.7 0-1.3.4-1.6.9l-7.7 13.4c-.3.6-.3 1.3 0 1.9l4 7c.3.6 1 .9 1.6.9h11.1c.7 0 1.3-.4 1.6-.9l7.7-13.4c.3-.6.3-1.3 0-1.9z"
      />
      <path fill="#12AAFF" d="M19.3 12.1l-2.7-4.7-4.1 7.1 2.7 4.7z" />
      <path fill="#9DCCED" d="M19.3 12.1l-2.7 4.7h5.4z" />
    </svg>
  ),
  'BNB Chain': (
    <svg viewBox="0 0 126.61 126.61" className="w-6 h-6">
      <path
        fill="#F3BA2F"
        d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.43 38.89l14.3 14.31zM0 63.31l14.3-14.3 14.31 14.3-14.31 14.3L0 63.31zm38.73 10.11l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88-.01-.01 14.32-14.3zm48.9-10.12l14.31-14.3 14.3 14.3-14.3 14.3-14.31-14.3z"
      />
      <path fill="#F3BA2F" d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47v-.01z" />
    </svg>
  ),
  Base: (
    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
      <span className="text-white text-xs font-bold">B</span>
    </div>
  ),
  Optimism: (
    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
      <span className="text-white text-xs font-bold">O</span>
    </div>
  ),
};

export const WalletDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadWallet();
  }, [id]);

  const loadWallet = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const workspaces = await WorkspaceService.getUserWorkspaces();
      if (workspaces.length === 0) {
        toast.error('No workspace found');
        navigate('/wallets');
        return;
      }

      const fetchedWallet = await WalletService.getWalletById(parseInt(id), workspaces[0].id);
      setWallet(fetchedWallet);

      // Fetch detailed balances including ERC20 tokens
      try {
        const balances = await WalletBalanceService.getWalletBalances(parseInt(id), workspaces[0].id);
        setWalletBalance(balances);
      } catch (balanceError) {
        console.error('Error fetching wallet balances:', balanceError);
        // Don't block the page if balance fetch fails
      }
    } catch (error: any) {
      console.error('Error loading wallet:', error);
      toast.error('Failed to load wallet');
      navigate('/wallets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResync = async () => {
    if (!wallet) return;

    setIsResyncing(true);
    try {
      await WalletService.resyncWallet(wallet.id, wallet.workspaceId);
      await loadWallet();
      toast.success('Wallet resynced successfully');
    } catch (error: any) {
      console.error('Error resyncing wallet:', error);
      toast.error(error.message || 'Failed to resync wallet');
    } finally {
      setIsResyncing(false);
    }
  };

  const handleDelete = async () => {
    if (!wallet) return;

    if (!confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await WalletService.deleteWallet(wallet.id, wallet.workspaceId);
      toast.success('Wallet deleted successfully');
      navigate('/wallets');
    } catch (error: any) {
      console.error('Error deleting wallet:', error);
      toast.error(error.message || 'Failed to delete wallet');
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!wallet) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/wallets" className="flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" />
                  Wallets
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{wallet.label || 'Wallet Details'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {wallet.label || 'Unnamed Wallet'}
              </h1>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  {wallet.address}
                </code>
                <button
                  onClick={() => copyToClipboard(wallet.address)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  title="Copy address"
                >
                  <Copy className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleResync}
                disabled={isResyncing}
              >
                {isResyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resyncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resync
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1 font-medium">Total Balance</div>
              <div className="text-2xl font-bold text-gray-900">
                ${walletBalance?.summary.totalUsd || wallet.totalBalanceUsd || '0.00'}
              </div>
              {walletBalance && (
                <div className="text-xs text-gray-500 mt-1">
                  Native: ${walletBalance.summary.totalNativeUsd}
                  {walletBalance.summary.totalTokenTypes > 0 && (
                    <> • Tokens: ${walletBalance.summary.totalTokensUsd}</>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1 font-medium">Total Transactions</div>
              <div className="text-2xl font-bold text-gray-900">
                {wallet.totalTransactions || 0}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1 font-medium">Active Chains</div>
              <div className="text-2xl font-bold text-gray-900">
                {wallet.chains?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Chain Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Chains</h2>

          {wallet.chains && wallet.chains.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {wallet.chains.map((chain) => (
                <div
                  key={chain.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {chainLogos[chain.chainName] || (
                          <div className="w-6 h-6 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {chain.chainName}
                        </div>
                        <div className="text-sm text-gray-500">Chain ID: {chain.chainId}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const explorerUrls: Record<string, string> = {
                          Ethereum: `https://etherscan.io/address/${wallet.address}`,
                          Polygon: `https://polygonscan.com/address/${wallet.address}`,
                          Arbitrum: `https://arbiscan.io/address/${wallet.address}`,
                          Base: `https://basescan.org/address/${wallet.address}`,
                          Optimism: `https://optimistic.etherscan.io/address/${wallet.address}`,
                          'BNB Chain': `https://bscscan.com/address/${wallet.address}`,
                          Avalanche: `https://snowtrace.io/address/${wallet.address}`,
                          Fantom: `https://ftmscan.com/address/${wallet.address}`,
                        };
                        window.open(explorerUrls[chain.chainName], '_blank');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Balance</div>
                      <div className="font-semibold text-gray-900 text-lg">
                        ${(() => {
                          const nativeUsd = parseFloat(chain.balanceUsd || '0');
                          const chainBalance = walletBalance?.balances.find(
                            (b) => b.chainName === chain.chainName
                          );
                          const tokensUsd =
                            chainBalance?.tokens.reduce(
                              (sum, token) => sum + (token.valueUsd || 0),
                              0
                            ) || 0;
                          return (nativeUsd + tokensUsd).toFixed(2);
                        })()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {parseFloat(chain.balance || '0').toFixed(4)}{' '}
                        {chain.chainName === 'Ethereum'
                          ? 'ETH'
                          : chain.chainName === 'Polygon'
                          ? 'MATIC'
                          : chain.chainName === 'BNB Chain'
                          ? 'BNB'
                          : chain.chainName === 'Avalanche'
                          ? 'AVAX'
                          : chain.chainName === 'Fantom'
                          ? 'FTM'
                          : 'native'}
                        {(walletBalance?.balances
                          .find((b) => b.chainName === chain.chainName)
                          ?.tokens.filter((t) => t.valueUsd && t.valueUsd > 0).length ?? 0) > 0 && (
                          <span className="text-xs"> + tokens</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Transactions</div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {chain.transactionCount}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {chain.transactionCount === 1 ? 'transaction' : 'transactions'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Last Activity</div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {chain.lastActivityAt
                          ? new Date(chain.lastActivityAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </div>
                      {chain.lastActivityDescription && (
                        <div className="text-sm text-gray-500 mt-1">
                          {chain.lastActivityDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active chains found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
