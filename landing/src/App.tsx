import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout, LandingContent } from './pages/landing/Landing';
import { BlogList } from './pages/blog/Blog';
import { BlogPost } from './pages/blog/BlogPost';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';

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
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <Toaster />
    </>
  );
};

export default App;
