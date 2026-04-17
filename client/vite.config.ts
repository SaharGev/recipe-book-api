import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/recipe-books': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
      '/api/recipes': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
      '/api/users': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
      '/api/auth': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
      '/api/ai': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
      '/api/likes': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
    }
  }
})