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
    port: 3434,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})