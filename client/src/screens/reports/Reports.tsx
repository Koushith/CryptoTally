import { Button } from '@/components/ui/button';
import { Download, FileText, Wallet, TrendingUp, Building2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const ReportsPage = () => {
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-gray-800">Reports & Export</h1>
          <p className="text-gray-500 text-sm mt-2">Generate reports for tax filing, accounting, and audits</p>
        </div>

        {/* Quick Export Cards */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">Quick Reports</h2>
            <p className="text-sm text-gray-500 mt-1">Pre-configured reports ready to download</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Tax Report',
                description: 'Transaction history with fiat values',
                icon: FileText,
                count: '1,247 transactions',
              },
              {
                title: 'Income Statement',
                description: 'Categorized inflows and outflows',
                icon: TrendingUp,
                count: '892 categorized',
              },
              {
                title: 'Wallet Summary',
                description: 'Balance and transaction overview',
                icon: Wallet,
                count: '12 wallets',
              },
            ].map((report) => (
              <div
                key={report.title}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <report.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-500 leading-snug">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{report.count}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Report Builder */}
        <div className="mb-16">
          <button
            onClick={() => setIsCustomReportOpen(!isCustomReportOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-all mb-4"
          >
            <div className="text-left">
              <h2 className="text-lg font-semibold text-gray-900">Custom Report Builder</h2>
              <p className="text-sm text-gray-500 mt-1">Create custom reports with filters</p>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isCustomReportOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isCustomReportOpen && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                      defaultValue="2024-01-01"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                      defaultValue="2024-12-31"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Wallets</label>
                  <div className="space-y-1.5 bg-gray-50 rounded-lg p-3">
                    {['Treasury Wallet', 'Payroll Wallet', 'Operations', 'Marketing Budget'].map((wallet) => (
                      <label
                        key={wallet}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-600">{wallet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Chains</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Ethereum', 'Polygon', 'Arbitrum', 'BNB Chain'].map((chain) => (
                      <label
                        key={chain}
                        className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-600">{chain}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Categories</label>
                  <div className="space-y-1.5 bg-gray-50 rounded-lg p-3">
                    {['Customer Payment', 'Vendor Expense', 'Grant', 'Salary', 'Gas Fees'].map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-600">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Transaction Type</label>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-600">Inflow</span>
                    </label>
                    <label className="flex-1 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-600">Outflow</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Export Format</label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                    <option>CSV (Excel Compatible)</option>
                    <option>JSON</option>
                    <option>PDF Report</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Include</label>
                  <div className="space-y-1.5">
                    {['Transaction notes', 'Tags', 'Attachment links'].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-gray-300"
                          defaultChecked={item !== 'Attachment links'}
                        />
                        <span className="text-sm text-gray-600">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">231 transactions</span> match your filters
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  Reset
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1.5" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Recent Exports */}
        <div>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">Recent Exports</h2>
            <p className="text-sm text-gray-500 mt-1">Download previously generated reports</p>
          </div>
          <div className="space-y-3">
            {[
              {
                name: 'Tax Report 2024 Q1',
                date: 'Jan 15, 2024',
                format: 'CSV',
                size: '245 KB',
                icon: FileText,
              },
              {
                name: 'Income Statement - January',
                date: 'Jan 10, 2024',
                format: 'PDF',
                size: '1.2 MB',
                icon: TrendingUp,
              },
              {
                name: 'Full Transaction History',
                date: 'Jan 5, 2024',
                format: 'CSV',
                size: '3.8 MB',
                icon: Building2,
              },
            ].map((export_item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-gray-200 hover:shadow-md rounded-xl p-4 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <export_item.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{export_item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{export_item.date}</span>
                      <span>•</span>
                      <span>{export_item.format}</span>
                      <span>•</span>
                      <span>{export_item.size}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1.5" />
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
