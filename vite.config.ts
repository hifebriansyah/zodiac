import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH: where the site is served. "/" in production; `npm run build:local` uses /for-fun/zodiac/ (local Apache, see .htaccess).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
  },
});
