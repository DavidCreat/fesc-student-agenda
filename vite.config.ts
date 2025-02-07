import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@auth': path.resolve(__dirname, './src/components/auth'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      'Content-Security-Policy': process.env.NODE_ENV === 'development' 
        ? "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
        : "default-src 'self'; connect-src 'self' http://localhost:5000; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; worker-src 'self' blob:;"
    }
  },
  build: {
    rollupOptions: {
      external: ['url'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@tanstack/react-query']
        }
      }
    }
  }
});