import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'production' &&
      removeConsole({
        includes: ['log', 'warn', 'info'],
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
