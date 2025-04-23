import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingScreen } from './pages';
import { BlogList } from './pages/blog/Blog';
import { BlogPost } from './pages/blog/BlogPost';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingScreen />,
    children: [
      {
        path: 'blog',
        element: <BlogList />,
      },
      {
        path: 'blog/:slug',
        element: <BlogPost />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
