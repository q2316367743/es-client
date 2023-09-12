import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

import path from 'path'


function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

function outDir() {
    switch (process.env.npm_lifecycle_event) {
        case 'IndexBuild:ts':
            return 'dist-ts';
        case 'IndexBuild:web':
            return 'dist-web';
        case 'IndexBuild:utools':
            return 'src-utools/dist';
        case 'IndexBuild:edge':
            return 'src-edge/domain-client';
        case 'IndexBuild:firefox':
            return 'src-firefox/domain-client';
        case 'IndexBuild:server':
            return 'src-server/public';
        case 'IndexBuild:tauri:windows':
            return 'dist';
        case 'IndexBuild:tauri:linux':
            return 'dist';
        case 'IndexBuild:tauri:macos':
            return 'dist';
        case 'IndexBuild:vscode':
            return 'src-vscode/domain-client';
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
            disable: process.env.npm_lifecycle_event !== 'IndexBuild:web',
            manifest: {
                name: 'domain-client',
                short_name: 'domain-client',
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
