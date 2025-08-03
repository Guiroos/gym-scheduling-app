import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: [
      { find: '@/', replacement: path.resolve(__dirname, 'src') },
      { find: '@/assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: '@/components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@/hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@/customTypes', replacement: path.resolve(__dirname, 'src/types') },
      { find: '@/pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@/routes', replacement: path.resolve(__dirname, 'src/routes') },
      { find: '@/services', replacement: path.resolve(__dirname, 'src/services') },
      { find: '@/queries', replacement: path.resolve(__dirname, 'src/services/indexedDb/queries') },
      { find: '@/theme', replacement: path.resolve(__dirname, 'src/theme') },
      { find: '@/utils', replacement: path.resolve(__dirname, 'src/utils') },
    ],
  },
});
