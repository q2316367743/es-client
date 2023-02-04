import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import i18n from '@/i18n';

// 引入样式
import '@/less/theme.less';
import '@/less/layout.less';
import '@/less/main.less';
import '@/less/post.css'
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-notification.css";

// VXETable导入
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css'

// @ts-ignore
if (window.utools) {
    utools.onPluginEnter(action => {
        sessionStorage.setItem('action', action.code);
    });
}

// 插件
createApp(App)
    .use(createPinia())
    .use(i18n)
    .use(VXETable)
    .mount('#app');
