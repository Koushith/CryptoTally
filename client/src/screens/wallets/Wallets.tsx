import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Activity, Plus, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WalletService, ChainScanResult, Wallet } from '@/services/wallet.service';
import { WalletBalanceService } from '@/services/wallet-balance.service';
import { WorkspaceService, Workspace } from '@/services/workspace.service';
import { toast } from 'sonner';
import { WorkspaceSelector } from '@/components/workspace/WorkspaceSelector';

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
};

export const WalletsPage = () => {
  // TODO: Implement automatic wallet syncing
  // - Add background job to resync wallets periodically (e.g., every 6 hours)
  // - Show sync status indicator on wallet cards
  // - Add last synced timestamp display
  // - Consider using WebSocket for real-time balance updates
  // - Add user preference for sync frequency

  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ChainScanResult[]>([]);
  const [scanStep, setScanStep] = useState<'input' | 'scanning' | 'results'>('input');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null); // For add wallet dialog
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<number | null>(null); // For viewing wallets
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletBalances, setWalletBalances] = useState<Map<number, string>>(new Map());
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);

  const navigate = useNavigate();

  // Load workspaces when dialog opens
  useEffect(() => {
    if (isAddWalletOpen) {
      loadWorkspaces();
    }
  }, [isAddWalletOpen]);

  // Load wallets when workspace changes
  useEffect(() => {
    if (currentWorkspaceId) {
      loadWallets();
    }
  }, [currentWorkspaceId]);

  const loadWorkspaces = async () => {
    setIsLoadingWorkspaces(true);
    try {
      const fetchedWorkspaces = await WorkspaceService.getUserWorkspaces();
      setWorkspaces(fetchedWorkspaces);

      // Auto-select first workspace if only one exists
      if (fetchedWorkspaces.length === 1) {
        setSelectedWorkspaceId(fetchedWorkspaces[0].id);
      }
    } catch (error: any) {
      console.error('Error loading workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoadingWorkspaces(false);
    }
  };

  const loadWallets = async () => {
    if (!currentWorkspaceId) {
      setWallets([]);
      setWalletBalances(new Map());
      setIsLoadingWallets(false);
      return;
    }

    setIsLoadingWallets(true);
    try {
      const fetchedWallets = await WalletService.getWallets(currentWorkspaceId);
      setWallets(fetchedWallets);

      // Fetch complete balances (including ERC20 tokens) for each wallet
      const balancesMap = new Map<number, string>();
      await Promise.all(
        fetchedWallets.map(async (wallet) => {
          try {
            const balanceData = await WalletBalanceService.getWalletBalances(
              wallet.id,
              currentWorkspaceId
            );
            balancesMap.set(wallet.id, balanceData.summary.totalUsd);
          } catch (error) {
            console.error(`Error fetching balance for wallet ${wallet.id}:`, error);
            // Use fallback to native token balance
            balancesMap.set(wallet.id, wallet.totalBalanceUsd || '0.00');
          }
        })
      );
      setWalletBalances(balancesMap);
    } catch (error: any) {
      console.error('Error loading wallets:', error);
      toast.error('Failed to load wallets');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const handleWorkspaceChange = (workspaceId: number) => {
    setCurrentWorkspaceId(workspaceId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  const handleWalletClick = (wallet: Wallet) => {
    navigate(`/wallets/${wallet.id}`);
  };

  const handleScanWallet = async () => {
    if (!walletAddress) return;

    // Validate workspace selection
    if (!selectedWorkspaceId) {
      toast.error('Please select a workspace');
      return;
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error('Invalid Ethereum address format');
      return;
    }

    setIsScanning(true);
    setScanStep('scanning');

    try {
      // Call backend API to add wallet and scan chains
      console.log('[Wallets] Scanning wallet for workspace:', selectedWorkspaceId);
      const response = await WalletService.addWallet(selectedWorkspaceId, walletAddress, walletLabel);
      console.log('[Wallets] API response:', response);

      // Transform API response to match UI format
      const transformedResults: ChainScanResult[] = response.data.scanResults.map((result) => ({
        chain: result.chain,
        chainId: result.chainId,
        hasActivity: result.hasActivity,
        transactionCount: result.transactionCount,
        balance: result.balance,
        balanceUsd: result.balanceUsd,
        lastActivity: result.lastActivity
          ? {
              timestamp: result.lastActivity.timestamp,
              description: result.lastActivity.description,
            }
          : undefined,
      }));

      setScanResults(transformedResults);
      setIsScanning(false);
      setScanStep('results');

      toast.success('Wallet scanned successfully!');
    } catch (error: any) {
      console.error('Error scanning wallet:', error);
      setIsScanning(false);
      setScanStep('input');
      toast.error(error.message || 'Failed to scan wallet');
    }
  };

  const handleConfirmWallet = () => {
    // Wallet is already saved by handleScanWallet
    // Just close the dialog and show success
    toast.success(`Wallet added with ${scanResults.filter((r) => r.hasActivity).length} active chains`);

    // Reset dialog
    setIsAddWalletOpen(false);
    setWalletAddress('');
    setWalletLabel('');
    setScanResults([]);
    setScanStep('input');
    setSelectedWorkspaceId(null);

    // Refresh wallet list
    loadWallets();
  };

  const handleCloseDialog = () => {
    setIsAddWalletOpen(false);
    setWalletAddress('');
    setWalletLabel('');
    setScanResults([]);
    setScanStep('input');
    setIsScanning(false);
    setSelectedWorkspaceId(null);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Wallets</h1>
                <WorkspaceSelector selectedWorkspaceId={currentWorkspaceId} onWorkspaceChange={handleWorkspaceChange} />
              </div>
              <p className="text-gray-500 text-sm mt-1">Manage your connected wallets across multiple chains</p>
            </div>
            <Button onClick={() => setIsAddWalletOpen(true)} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Wallet
            </Button>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="mb-8 md:mb-16">
          {isLoadingWallets ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : wallets.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                {/* Illustration */}
                <div className="mb-6">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-48 h-48 mx-auto"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Wallet illustration */}
                    <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
                    <rect x="60" y="75" width="80" height="50" rx="8" fill="#E5E7EB" />
                    <rect x="60" y="75" width="80" height="15" rx="8" fill="#9CA3AF" />
                    <circle cx="75" cy="105" r="4" fill="#9CA3AF" />
                    <line x1="85" y1="105" x2="125" y2="105" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    <line x1="85" y1="115" x2="115" y2="115" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />

                    {/* Floating chain icons */}
                    <g opacity="0.6">
                      <circle cx="45" cy="60" r="12" fill="#3B82F6" />
                      <text x="45" y="65" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                        Ξ
                      </text>
                    </g>
                    <g opacity="0.6">
                      <circle cx="155" cy="60" r="12" fill="#8B5CF6" />
                      <text x="155" y="65" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                        P
                      </text>
                    </g>
                    <g opacity="0.6">
                      <circle cx="40" cy="140" r="12" fill="#10B981" />
                      <text x="40" y="145" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                        A
                      </text>
                    </g>
                    <g opacity="0.6">
                      <circle cx="160" cy="140" r="12" fill="#F59E0B" />
                      <text x="160" y="145" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                        B
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No wallets yet</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Add your first wallet to start tracking transactions across multiple chains
                </p>

                {/* Action Button */}
                <Button onClick={() => setIsAddWalletOpen(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  onClick={() => handleWalletClick(wallet)}
                  className="group bg-white rounded-2xl md:rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm md:shadow-none md:hover:shadow-md active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                        {wallet.chains && wallet.chains.length > 0 && chainLogos[wallet.chains[0].chainName] ? (
                          chainLogos[wallet.chains[0].chainName]
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">{wallet.label || 'Unnamed Wallet'}</h3>
                        <p className="text-xs text-gray-500">
                          {wallet.chains?.length || 0} active {wallet.chains?.length === 1 ? 'chain' : 'chains'}
                        </p>
                      </div>
                    </div>
                    {/* Chain Icons Row */}
                    <div className="flex items-center gap-1">
                      {wallet.chains &&
                        wallet.chains.slice(0, 3).map((chain) => (
                          <div
                            key={chain.id}
                            className="w-6 h-6 rounded border border-gray-200 bg-white flex items-center justify-center"
                            title={chain.chainName}
                          >
                            <div className="scale-75">
                              {chainLogos[chain.chainName] || <div className="w-4 h-4 rounded-full bg-gray-300" />}
                            </div>
                          </div>
                        ))}
                      {wallet.chains && wallet.chains.length > 3 && (
                        <div className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                          <span className="text-[9px] font-semibold text-gray-600">+{wallet.chains.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Balance</div>
                      <div className="text-3xl font-bold text-gray-800">
                        ${walletBalances.get(wallet.id) || wallet.totalBalanceUsd || '0.00'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600">{wallet.totalTransactions || 0} txs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">+ ERC20s</span>
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
                          toast.success('Address copied to clipboard');
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
          )}
        </div>

        {/* Add Wallet Dialog */}
        <Dialog open={isAddWalletOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>
                {scanStep === 'input' && 'Add New Wallet'}
                {scanStep === 'scanning' && 'Scanning Blockchain Networks'}
                {scanStep === 'results' && 'Wallet Scan Results'}
              </DialogTitle>
              <DialogDescription>
                {scanStep === 'input' && 'Enter your wallet address to automatically scan all supported chains'}
                {scanStep === 'scanning' && 'Checking activity across multiple blockchain networks...'}
                {scanStep === 'results' &&
                  `Found activity on ${scanResults.filter((r) => r.hasActivity).length} chains`}
              </DialogDescription>
            </DialogHeader>

            {/* Step 1: Input */}
            {scanStep === 'input' && (
              <>
                <div className="grid gap-6 py-4">
                  {/* Workspace Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="workspace" className="text-sm font-medium text-gray-700">
                      Workspace <span className="text-red-500">*</span>
                    </Label>
                    {isLoadingWorkspaces ? (
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-600">Loading workspaces...</span>
                      </div>
                    ) : workspaces.length === 0 ? (
                      <div className="p-3 border border-amber-200 rounded-md bg-amber-50">
                        <p className="text-sm text-amber-800">No workspaces found. Please refresh the page.</p>
                      </div>
                    ) : (
                      <>
                        <Select
                          value={selectedWorkspaceId?.toString()}
                          onValueChange={(value) => setSelectedWorkspaceId(parseInt(value))}
                        >
                          <SelectTrigger className="border-gray-200 focus:border-gray-900">
                            <SelectValue placeholder="Select a workspace" />
                          </SelectTrigger>
                          <SelectContent>
                            {workspaces.map((workspace) => (
                              <SelectItem key={workspace.id} value={workspace.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{workspace.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({workspace.type === 'personal' ? 'Personal' : 'Organization'})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">The wallet will be added to this workspace</p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet-label" className="text-sm font-medium text-gray-700">
                      Wallet Label <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="wallet-label"
                      placeholder="e.g., Treasury Wallet, Operations, Personal"
                      value={walletLabel}
                      onChange={(e) => setWalletLabel(e.target.value)}
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet-address" className="text-sm font-medium text-gray-700">
                      Wallet Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="wallet-address"
                      placeholder="0x... or vitalik.eth"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="font-mono text-sm border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                    <p className="text-xs text-gray-500">
                      Enter an Ethereum address or ENS name. We'll automatically check across all EVM chains.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Read-only & Secure</p>
                        <p className="text-xs text-blue-700">
                          No private keys needed. We only read public blockchain data to track your transactions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleScanWallet}
                    disabled={!walletAddress || !selectedWorkspaceId || isLoadingWorkspaces}
                  >
                    Scan Wallet
                  </Button>
                </div>
              </>
            )}

            {/* Step 2: Scanning */}
            {scanStep === 'scanning' && (
              <div className="py-12">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-gray-900">Scanning blockchain networks...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <div className="text-xs text-gray-500 text-center">Checking 15+ networks</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Ethereum', 'Polygon', 'Arbitrum', 'Base', 'Optimism', 'BNB Chain'].map((chain) => (
                        <div key={chain} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {chain}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {scanStep === 'results' && (
              <>
                <div className="py-4 space-y-4">
                  {/* Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900">
                        Found activity on {scanResults.filter((r) => r.hasActivity).length} chains with{' '}
                        {scanResults.reduce((sum, r) => sum + r.transactionCount, 0)} total transactions
                      </p>
                    </div>
                  </div>

                  {/* Active Chains */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Active Chains</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {scanResults
                        .filter((result) => result.hasActivity)
                        .map((result) => (
                          <div
                            key={result.chain}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                                {chainLogos[result.chain]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{result.chain}</p>
                                <p className="text-xs text-gray-500">
                                  {result.transactionCount} transactions
                                  {result.lastActivity &&
                                    ` • Last: ${WalletService.formatTimeAgo(result.lastActivity.timestamp)}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {result.balance}{' '}
                                {result.chain === 'Ethereum' ||
                                result.chain === 'Arbitrum' ||
                                result.chain === 'Base' ||
                                result.chain === 'Optimism'
                                  ? 'ETH'
                                  : result.chain === 'Polygon'
                                  ? 'MATIC'
                                  : result.chain === 'BNB Chain'
                                  ? 'BNB'
                                  : result.chain === 'Avalanche'
                                  ? 'AVAX'
                                  : result.chain === 'Fantom'
                                  ? 'FTM'
                                  : ''}
                              </p>
                              <p className="text-xs text-gray-500">${result.balanceUsd.toFixed(2)}</p>
                              <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto mt-1" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Inactive Chains */}
                  {scanResults.filter((r) => !r.hasActivity).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        No Activity Detected ({scanResults.filter((r) => !r.hasActivity).length} chains)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scanResults
                          .filter((result) => !result.hasActivity)
                          .map((result) => (
                            <div
                              key={result.chain}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500"
                            >
                              <XCircle className="h-3 w-3" />
                              {result.chain}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmWallet}>
                    Add Wallet ({scanResults.filter((r) => r.hasActivity).length} chains)
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
