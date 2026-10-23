import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 让各组件的 <style lang="scss"> 能使用 $namespace / $elNamespace。
        // 变量文件自身不再注入，避免 @use 循环。
        additionalData(source, filename) {
          if (filename.includes('styles/variables.scss') || filename.includes('styles/global.module.scss')) {
            return source
          }
          return `@use "@/styles/variables.scss" as *;\n${source}`
        }
      }
    }
  },
  // 所有以 /api 开头的请求将被转发到 http://localhost:48080，并移除路径中的 /api 前缀。
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:48080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
