import { Button } from '@/components/ui/button';
import { Download, FileText, Wallet, TrendingUp, Building2, Clock } from 'lucide-react';

export const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-gray-800">Reports & Export</h1>
          <p className="text-gray-500 text-sm mt-2">Generate reports for tax filing, accounting, and audits</p>
        </div>

        {/* Quick Export Cards */}
        <div className="mb-12">
          <h2 className="text-[20px] font-bold text-gray-800 mb-6">Quick Reports</h2>
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                title: 'Tax Report',
                description: 'Complete transaction history with fiat values',
                icon: FileText,
                bg: 'bg-blue-50',
                iconColor: 'text-blue-600',
              },
              {
                title: 'Income Statement',
                description: 'Categorized inflows and outflows by tag',
                icon: TrendingUp,
                bg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
              },
              {
                title: 'Wallet Summary',
                description: 'Balance and transaction count per wallet',
                icon: Wallet,
                bg: 'bg-purple-50',
                iconColor: 'text-purple-600',
              },
            ].map((report) => (
              <div
                key={report.title}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${report.bg} flex items-center justify-center mb-4`}>
                  <report.icon className={`h-6 w-6 ${report.iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-gray-900 group-hover:text-white transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Report Builder */}
        <div className="mb-12">
          <h2 className="text-[20px] font-bold text-gray-800 mb-6">Custom Report</h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Date Range</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      className="flex-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                      defaultValue="2024-01-01"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="date"
                      className="flex-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                      defaultValue="2024-12-31"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Wallets</label>
                  <div className="space-y-2 bg-white rounded-xl p-3">
                    {['Treasury Wallet', 'Payroll Wallet', 'Operations', 'Marketing Budget'].map((wallet) => (
                      <label
                        key={wallet}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">{wallet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Chains</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Ethereum', 'Polygon', 'Arbitrum', 'BNB Chain'].map((chain) => (
                      <label
                        key={chain}
                        className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">{chain}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Categories</label>
                  <div className="space-y-2 bg-white rounded-xl p-3">
                    {['Customer Payment', 'Vendor Expense', 'Grant', 'Salary', 'Gas Fees'].map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-700">Inflow</span>
                    </label>
                    <label className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-700">Outflow</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Export Format</label>
                  <select className="w-full px-4 py-2.5 bg-white border-0 rounded-xl text-sm font-medium text-gray-700">
                    <option>CSV (Excel Compatible)</option>
                    <option>JSON</option>
                    <option>PDF Report</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Include</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Transaction notes', 'Tags', 'Attachment links'].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          defaultChecked={item !== 'Attachment links'}
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">231 transactions</span> match your filters
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  Reset Filters
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Exports */}
        <div>
          <h2 className="text-[20px] font-bold text-gray-800 mb-6">Recent Exports</h2>
          <div className="space-y-3">
            {[
              {
                name: 'Tax Report 2024 Q1',
                date: '2024-01-15',
                format: 'CSV',
                size: '245 KB',
                icon: FileText,
                color: 'bg-blue-50',
                iconColor: 'text-blue-600',
              },
              {
                name: 'Income Statement - January',
                date: '2024-01-10',
                format: 'PDF',
                size: '1.2 MB',
                icon: TrendingUp,
                color: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
              },
              {
                name: 'Full Transaction History',
                date: '2024-01-05',
                format: 'CSV',
                size: '3.8 MB',
                icon: Building2,
                color: 'bg-purple-50',
                iconColor: 'text-purple-600',
              },
            ].map((export_item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${export_item.color}`}>
                    <export_item.icon className={`h-5 w-5 ${export_item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{export_item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{export_item.date}</span>
                      <span>•</span>
                      <span>{export_item.format}</span>
                      <span>•</span>
                      <span>{export_item.size}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="group-hover:bg-gray-900 group-hover:text-white transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
