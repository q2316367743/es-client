import { createApp } from 'vue';
import store from "@/store";
import App from './App.vue';
import i18n from '@/i18n';
import router from "@/plugins/router";

// 额外引入图标库
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

// 引入样式
import '@/less/theme.less';
import '@/less/main.less';
import '@/less/post.css';
import '@/less/customer.less';
import '@/components/JsonTree/index.less';

// arco样式
import '@arco-design/web-vue/dist/arco.css';

// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = { // 提供一个定义worker路径的全局变量
    getWorker(_: string, label: string) {
        if (label === 'json') {
            return new JsonWorker()
        }
        if (['css', 'scss', 'less'].includes(label)) {
            return new CssWorker()
        }
        if (['html', 'handlebars', 'razor'].includes(label)) {
            return new HtmlWorker()
        }
        if (['typescript', 'javascript'].includes(label)) {
            return new TsWorker()
        }
        return new EditorWorker()
    }
};

window.addEventListener('message', event => {
    const message = event.data;
    if (message['type'] === 'url-open') {
        sessionStorage.setItem('action', message['content']);
    }
});

// 插件
createApp(App)
    .use(ArcoVue)
    .use(store)
    .use(i18n)
    .use(ArcoVueIcon)
    .use(router)
    .mount('#app');

