import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import i18n from '@/i18n';
import './theme.less';
import './main.less';

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

createApp(App)
    .use(createPinia())
    .use(i18n)
    .use(VXETable)
    .mount('#app');
