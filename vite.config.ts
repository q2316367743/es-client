import { defineConfig } from 'vite'
import monacoEditorPlugin from "vite-plugin-monaco-editor"
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
            '@': _resolve('src'),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        }
    },
    plugins: [vue(), monacoEditorPlugin()],
    base: './'
})