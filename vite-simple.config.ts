import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configure path aliases for the new structure
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src-new'),
    },
  },

  // Development server configuration
  server: {
    port: 3141,
    host: '0.0.0.0',
    cors: true,
  },

  // Build configuration
  build: {
    outDir: 'dist-new',
    sourcemap: true,
  },
});

