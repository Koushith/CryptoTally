import { Button } from '@/components/ui/button';
import { Bell, Settings, X, Mail, Webhook as WebhookIcon } from 'lucide-react';
import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'accounting' | 'automation';
  connected: boolean;
  comingSoon?: boolean;
  brandColor: string;
  logo?: React.ReactNode;
}

export const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notified about new transactions and wallet activities in your Slack channels',
      category: 'communication',
      connected: false,
      brandColor: '#4A154B',
      logo: (
        <svg viewBox="0 0 124 124" className="w-6 h-6">
          <path fill="#E01E5A" d="M26.3 78.2c0 7.3-5.9 13.2-13.2 13.2C5.9 91.4 0 85.5 0 78.2c0-7.3 5.9-13.2 13.2-13.2h13.2v13.2zM32.8 78.2c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33z"/>
          <path fill="#36C5F0" d="M46 26.3c-7.3 0-13.2-5.9-13.2-13.2C32.8 5.9 38.7 0 46 0s13.2 5.9 13.2 13.2v13.2H46zM46 32.8c7.3 0 13.2 5.9 13.2 13.2S53.3 59.2 46 59.2H13.1C5.9 59.2 0 53.3 0 46s5.9-13.2 13.2-13.2H46z"/>
          <path fill="#2EB67D" d="M97.7 46c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H97.7V46zM91.3 46c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.1C64.9 5.9 70.8 0 78.1 0c7.3 0 13.2 5.9 13.2 13.2V46z"/>
          <path fill="#ECB22E" d="M78.1 97.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V97.7h13.2zM78.1 91.3c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h32.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H78.1z"/>
        </svg>
      ),
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Receive real-time transaction alerts via Telegram bot',
      category: 'communication',
      connected: false,
      brandColor: '#0088cc',
      logo: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#26A5E4">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.122.098.155.23.171.324.016.094.036.308.02.475z"/>
        </svg>
      ),
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Post transaction updates to Discord channels for team visibility',
      category: 'communication',
      connected: false,
      brandColor: '#5865F2',
      logo: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#5865F2">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
    },
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Receive daily or weekly summaries of your crypto transactions',
      category: 'communication',
      connected: true,
      brandColor: '#EA4335',
      logo: <Mail className="w-6 h-6 text-red-500" />,
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Sync transactions to QuickBooks for seamless accounting',
      category: 'accounting',
      connected: false,
      comingSoon: true,
      brandColor: '#2CA01C',
      logo: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#2CA01C">
          <path d="M13.001 2.007L4.36 6.001v11.998l8.641-3.994V2.007zm7.639 3.994v11.998l-7.639 3.994v-11.998l7.639-3.994z"/>
        </svg>
      ),
    },
    {
      id: 'xero',
      name: 'Xero',
      description: 'Export transaction data directly to Xero accounting software',
      category: 'accounting',
      connected: false,
      comingSoon: true,
      brandColor: '#13B5EA',
      logo: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#13B5EA">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.691s1.205-2.69 2.69-2.69c1.486 0 2.691 1.205 2.691 2.69s-1.205 2.691-2.69 2.691zM5.415 9.275c1.485 0 2.69 1.205 2.69 2.69s-1.205 2.691-2.69 2.691c-1.486 0-2.691-1.206-2.691-2.69s1.205-2.691 2.69-2.691zm9.086 7.84l-4.516-5.172 4.324-4.96h-2.372L9.338 10.31l-2.6-3.328H4.365l3.297 4.239-3.297 3.784h2.373l2.6-2.981 2.599 3.091h2.564z"/>
        </svg>
      ),
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect to 5000+ apps and automate your crypto accounting workflows',
      category: 'automation',
      connected: false,
      comingSoon: true,
      brandColor: '#FF4A00',
      logo: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#FF4A00">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.263 16.842l-.008-3.169H9.737l3.421-5.684.008 3.17h3.517l-3.42 5.683z"/>
        </svg>
      ),
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Send transaction data to your custom endpoints in real-time',
      category: 'automation',
      connected: false,
      brandColor: '#000000',
      logo: <WebhookIcon className="w-6 h-6 text-gray-900" />,
    },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(int =>
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'communication': return 'Communication';
      case 'accounting': return 'Accounting Software';
      case 'automation': return 'Automation & Workflows';
      default: return category;
    }
  };

  const categories = ['communication', 'accounting', 'automation'] as const;

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Integrations</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Connect CryptoTally with your favorite tools</p>
        </div>

        {/* Connected Integrations */}
        {integrations.some(int => int.connected) && (
          <div className="mb-8 md:mb-16">
            <div className="mb-4 md:mb-8">
              <h2 className="text-lg font-semibold text-gray-800">Connected</h2>
              <p className="text-sm text-gray-500 mt-1">Your active integrations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {integrations.filter(int => int.connected).map((integration) => (
                <div
                  key={integration.id}
                  className="group bg-white rounded-2xl md:rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm md:shadow-none transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                      {integration.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">{integration.name}</h3>
                      <p className="text-sm text-gray-500 leading-snug">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => toggleConnection(integration.id)}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Disconnect
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-gray-600 hover:text-gray-800 border-gray-200"
                      >
                        <Settings className="h-3.5 w-3.5 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Integrations by Category */}
        {categories.map((category) => {
          const categoryIntegrations = integrations.filter(
            int => int.category === category && !int.connected
          );

          if (categoryIntegrations.length === 0) return null;

          return (
            <div key={category} className="mb-8 md:mb-16">
              <div className="mb-4 md:mb-8">
                <h2 className="text-lg font-semibold text-gray-800">{getCategoryName(category)}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {category === 'communication' && 'Get notified about transactions across your team'}
                  {category === 'accounting' && 'Sync transactions with your accounting tools'}
                  {category === 'automation' && 'Build custom workflows and automations'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {categoryIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="group bg-white rounded-2xl md:rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm md:shadow-none md:hover:shadow-md active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                        {integration.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">{integration.name}</h3>
                        <p className="text-sm text-gray-500 leading-snug">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {integration.comingSoon ? '' : 'Available'}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-gray-600 hover:text-gray-800 border-gray-200"
                        onClick={() => !integration.comingSoon && toggleConnection(integration.id)}
                        disabled={integration.comingSoon}
                      >
                        {integration.comingSoon ? 'Coming Soon' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Custom Integration CTA */}
        <div className="bg-gray-900 text-white rounded-2xl md:rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Need a custom integration?</h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                We're always looking to add more integrations. Let us know which tools you'd like to connect with CryptoTally.
              </p>
              <Button size="sm" variant="secondary">
                Request Integration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
