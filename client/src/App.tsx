import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import {
  DashboardPage,
  WalletsPage,
  WalletDetailPage,
  TransactionsPage,
  ReportsPage,
  SettingsPage,
  IntegrationsPage,
  ProfilePage,
  WorkspacePage,
  FeedbackPage,
  WaitlistPage,
  AcceptInvitePage,
  ErrorScreen,
} from './screens';
import { Auth } from './screens/auth/Auth';
import { ComingSoon } from '@/components/ComingSoon';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Key, Webhook } from 'lucide-react';
import dataAnalystImg from '@/assets/illustrations/data-analyst.png';
import analyticsImg from '@/assets/illustrations/analytics.png';

const router = createBrowserRouter([
  // Public routes
  {
    path: '/auth',
    element: <Auth />,
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
  {
    path: '/invite/:token',
    element: <AcceptInvitePage />,
    errorElement: <ErrorScreen />,
  },
  // Protected routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
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
        path: '/wallets/:id',
        element: <WalletDetailPage />,
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
        path: '/workspace',
        element: <WorkspacePage />,
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
