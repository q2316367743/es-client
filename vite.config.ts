import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'


function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': _resolve('src'),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        }
    },
    plugins: [
        vue(),
    ],
    base: './',
    build: {
        outDir: "src-utools/dist"
    },
    // 强制预构建插件包
    optimizeDeps: {
        include: [
            `monaco-editor/esm/vs/language/typescript/ts.worker`,
            `monaco-editor/esm/vs/editor/editor.worker`
        ],
    },
    envDir: 'env'
})
