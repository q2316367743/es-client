import { createApp } from 'vue';
import store from "@/store";
import App from './App.vue';
import i18n from '@/i18n';
import { applicationLaunch } from "@/global/BeanFactory";
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
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = { // 提供一个定义worker路径的全局变量
    getWorker() {
        return new EditorWorker(); // 基础功能文件， 提供了所有语言通用功能 无论使用什么语言，monaco都会去加载他。
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

applicationLaunch.executeInit();
