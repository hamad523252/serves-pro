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
    port: 5173,
    host: '0.0.0.0',
    cors: true,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    }
  },

  // Handle fallback for SPA routing
  preview: {
    port: 4173,
    host: '0.0.0.0',
  },

  // Optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux']
  }
});