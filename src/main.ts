import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import i18n from '@/i18n';
import './main.less';

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

createApp(App)
    .use(createPinia())
    .use(ElementPlus)
    .use(i18n)
    .use(VXETable)
    .mount('#app');
