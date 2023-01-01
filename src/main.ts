import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import i18n from '@/i18n';

// 引入样式
import './theme.less';
import './main.less';
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-loading.css";

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

createApp(App)
    .use(createPinia())
    .use(i18n)
    .use(VXETable)
    .mount('#app');
