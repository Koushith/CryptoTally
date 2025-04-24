// @ts-nocheck
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    mode === 'production' &&
      removeConsole({
        includes: ['log', 'warn', 'info'],
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': '/src/assets',
    },
  },

  // For Vite 4.x and above, use this
  preview: {
    historyApiFallback: true,
  },

  // For development server
  server: {
    middleware: [
      (req, res, next) => {
        if (req.url?.endsWith('.html')) {
          req.url = '/';
        }
        next();
      },
    ],
  },
})) as UserConfig;
