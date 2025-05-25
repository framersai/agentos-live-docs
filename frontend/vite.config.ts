// File: frontend/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // Fix for router-view v-slot issue
      template: {
        transformAssetUrls: {
          base: '/src',
        },
        compilerOptions: {
          isCustomElement: tag => tag === 'TransitionGroup' || tag === 'transition'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,  // Changed from 3434 to 3000
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Changed from 3333 to 3001
        changeOrigin: true,
      },
    },
  },
})