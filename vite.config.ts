import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'

import path from 'path'


function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

function outDir() {
    switch (process.env.npm_lifecycle_event) {
        case 'build:edge':
            return 'src-edge/domain-client';
        case 'build:firefox':
            return 'src-firefox/domain-client';
        case 'build:vscode':
            return 'src-vscode/domain-client';
        default:
            return 'dist';
    }
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
        vue(),VueJsx(),
    ],
    base: './',
    build: {
        outDir: outDir()
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
