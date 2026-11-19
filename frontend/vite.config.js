import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':       { target: 'http://localhost:8080', changeOrigin: true },
      '/products':   { target: 'http://localhost:8080', changeOrigin: true },
      '/categories': { target: 'http://localhost:8080', changeOrigin: true },
      '/suppliers':  { target: 'http://localhost:8080', changeOrigin: true },
      '/reviews':    { target: 'http://localhost:8080', changeOrigin: true },
      '/orders':     { target: 'http://localhost:8080', changeOrigin: true },
      '/cart':       { target: 'http://localhost:8080', changeOrigin: true },
      '/health':     { target: 'http://localhost:8080', changeOrigin: true },
      '/dashboard':  { target: 'http://localhost:8080', changeOrigin: true },
      '/address':    { target: 'http://localhost:8080', changeOrigin: true },
      '/payments':   { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
