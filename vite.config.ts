import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { VitePWA } from 'vite-plugin-pwa'

import path from 'path'

// 插件
import { visualizer } from 'rollup-plugin-visualizer';

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
            return 'utools';
        case 'build:edge':
            return 'dist-edge/es-client';
        case 'build:chrome':
            return 'dist-chrome/es-client';
        case 'build:firefox':
            return 'dist-firefox/es-client';
        case 'build:server':
            return 'dist-server/public';
        case 'build:tauri:windows':
            return 'dist';
        case 'build:tauri:linux':
            return 'dist';
        case 'build:tauri:macos':
            return 'dist';
        case 'build:vscode':
            return 'dist-vscode/es-client';
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
        visualizer({ open: true }),
        AutoImport({
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [ArcoResolver({
                sideEffect: true
            })],
        }),
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
    }
})