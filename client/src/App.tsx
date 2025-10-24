import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import {
  DashboardPage,
  WalletsPage,
  TransactionsPage,
  ReportsPage,
  SettingsPage,
  IntegrationsPage,
  ProfilePage,
  FeedbackPage,
  WaitlistPage,
  ErrorScreen,
} from './screens';
import { ComingSoon } from '@/components/ComingSoon';
import { Key, Webhook, FileCode } from 'lucide-react';
import dataAnalystImg from '@/assets/illustrations/data-analyst.png';
import analyticsImg from '@/assets/illustrations/analytics.png';
import reportingStatsImg from '@/assets/illustrations/reporting.png';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/wallets',
        element: <WalletsPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/transactions',
        element: <TransactionsPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/reports',
        element: <ReportsPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/integrations',
        element: <IntegrationsPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/feedback',
        element: <FeedbackPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/waitlist',
        element: <WaitlistPage />,
        errorElement: <ErrorScreen />,
      },
      // Developer routes
      {
        path: '/api-keys',
        element: (
          <ComingSoon
            icon={Key}
            title="API Keys"
            description="Generate and manage API keys to programmatically access your transaction data."
            illustrationUrl={dataAnalystImg}
          />
        ),
      },
      {
        path: '/webhooks',
        element: (
          <ComingSoon
            icon={Webhook}
            title="Webhooks"
            description="Set up webhooks to receive real-time notifications about new transactions and wallet events."
            illustrationUrl={analyticsImg}
          />
        ),
      },
      {
        path: '/documentation',
        element: (
          <ComingSoon
            icon={FileCode}
            title="API Documentation"
            description="Comprehensive guides and references for integrating with the CryptoTally API."
            illustrationUrl={reportingStatsImg}
          />
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
