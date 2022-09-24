import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import {createPinia} from 'pinia';
import App from './App.vue';
import i18n from '@/i18n';
import './main.less';

createApp(App).use(createPinia()).use(ElementPlus).use(i18n).mount('#app');
