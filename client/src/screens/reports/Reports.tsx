import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Calendar, Filter, Wallet, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Reports & Export</h1>
            <p className="text-gray-500 text-sm mt-2">Generate custom reports and export transaction data.</p>
          </div>
        </div>

        {/* Quick Export Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Tax Report',
              description: 'Complete transaction history with fiat values for tax filing',
              icon: FileText,
              color: 'bg-gray-900',
            },
            {
              title: 'Income Statement',
              description: 'Categorized inflows and outflows by tag',
              icon: Tag,
              color: 'bg-green-500',
            },
            {
              title: 'Wallet Summary',
              description: 'Balance and transaction count per wallet',
              icon: Wallet,
              color: 'bg-purple-500',
            },
          ].map((report) => (
            <Card key={report.title} className="p-6 hover:border-primary transition-colors">
              <div className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center mb-4`}>
                <report.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-[15px] font-medium text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{report.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card className="p-6 mb-8">
          <h2 className="text-[17px] font-medium text-gray-900 mb-6">Custom Report</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Filters */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm"
                        defaultValue="2024-01-01"
                      />
                    </div>
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm"
                        defaultValue="2024-12-31"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Wallets</label>
                <select className="w-full text-sm border-gray-200 rounded-md px-3 py-2 bg-white" multiple size={4}>
                  <option>Treasury Wallet</option>
                  <option>Payroll Wallet</option>
                  <option>Operations</option>
                  <option>Marketing Budget</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Hold Cmd/Ctrl to select multiple</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Chains</label>
                <div className="space-y-2">
                  {['Ethereum', 'Polygon', 'Arbitrum', 'BNB Chain'].map((chain) => (
                    <label key={chain} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-700">{chain}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                <div className="space-y-2">
                  {['Customer Payment', 'Vendor Expense', 'Grant', 'Salary', 'Gas Fees'].map((tag) => (
                    <label key={tag} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Transaction Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Inflow</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Outflow</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Export Format</label>
                <select className="w-full text-sm border-gray-200 rounded-md px-3 py-2 bg-white">
                  <option>CSV (Excel Compatible)</option>
                  <option>JSON</option>
                  <option>PDF Report</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Include</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Transaction notes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Tags</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Attachment links</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t">
            <div className="text-sm text-gray-600">
              <span className="font-medium">231 transactions</span> match your filters
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Exports */}
        <Card className="p-6">
          <h2 className="text-[15px] font-medium text-gray-900 mb-4">Recent Exports</h2>
          <div className="space-y-3">
            {[
              { name: 'Tax Report 2024 Q1', date: '2024-01-15', format: 'CSV', size: '245 KB' },
              { name: 'Income Statement - January', date: '2024-01-10', format: 'PDF', size: '1.2 MB' },
              { name: 'Full Transaction History', date: '2024-01-05', format: 'CSV', size: '3.8 MB' },
            ].map((export_item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{export_item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {export_item.date} · {export_item.format} · {export_item.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
