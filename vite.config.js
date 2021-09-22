import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/screen': {
        target: 'https://gl.sz.bmdigitech.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/screen/, '')
      }
    }
  }
})
