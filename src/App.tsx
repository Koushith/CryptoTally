import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout, LandingContent } from './pages/landing/Landing';
import { BlogList } from './pages/blog/Blog';
import { BlogPost } from './pages/blog/BlogPost';
import { AuthScreen } from './auth/Auth';
import { AppLayout } from './layouts/AppLayout';

export enum Routes {
  Root = '/',
  Blog = '/blog',
  BlogPost = '/blog/:slug',
  Auth = '/auth',
  Dashboard = '/dashboard',
  Wallets = '/wallets',
  Transactions = '/transactions',
  Team = '/team',
  Settings = '/settings',
}

const router = createBrowserRouter([
  {
    path: Routes.Root,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingContent />,
      },
      {
        path: Routes.Blog,
        element: <BlogList />,
      },
      {
        path: Routes.BlogPost,
        element: <BlogPost />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: Routes.Auth,
        element: <AuthScreen />,
      },
      {
        path: Routes.Dashboard,
        element: <div>Dashboard Content</div>,
      },
      {
        path: Routes.Wallets,
        element: <div>Wallets Content</div>,
      },
      {
        path: Routes.Transactions,
        element: <div>Transactions Content</div>,
      },
      {
        path: Routes.Team,
        element: <div>Team Content</div>,
      },
      {
        path: Routes.Settings,
        element: <div>Settings Content</div>,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
