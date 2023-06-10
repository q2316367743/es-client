import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

import path from 'path'


function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

function outDir() {
    switch (process.env.npm_lifecycle_event) {
        case 'build:ts':
            return 'dist-ts';
        case 'build:web':
            return 'dist-web';
        case 'build:utools':
            return 'src-utools/dist';
        case 'build:edge':
            return 'src-edge/es-client';
        case 'build:firefox':
            return 'src-firefox/es-client';
        case 'build:server':
            return 'src-server/public';
        case 'build:tauri:windows':
            return 'dist';
        case 'build:tauri:linux':
            return 'dist';
        case 'build:tauri:macos':
            return 'dist';
        case 'build:vscode':
            return 'src-vscode/es-client';
        default:
            return 'out';
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
        vue(),
        VitePWA({
            // 只要不是web模式，禁用PWA
            disable: process.env.npm_lifecycle_event !== 'build:web',
            manifest: {
                name: 'es-client',
                short_name: 'es-client',
                description: 'elasticsearch查询客户端',
                background_color: '#165dff',
                icons: [{
                    "src": "./logo.png"
                }],
                lang: 'zh-CN',
            }
        })
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