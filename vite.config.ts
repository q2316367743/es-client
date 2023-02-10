import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ArcoResolver} from 'unplugin-vue-components/resolvers';

import path from 'path'

// 插件
import {visualizer} from 'rollup-plugin-visualizer';

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

function outDir() {
    switch (process.env.npm_lifecycle_event) {
        case 'build:ts':
            return 'dist';
        case 'build:utools':
            return 'utools';
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
    plugins: [vue(), visualizer({open: true}),
        AutoImport({
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [ArcoResolver({
                sideEffect: true
            })],
        }),
    ],
    base: './',
    build: {
        outDir: outDir()
    }
})