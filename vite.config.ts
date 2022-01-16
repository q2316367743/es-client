import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
// import path from 'path'

function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': _resolve('src')
    }
  },
  plugins: [vue()]
})