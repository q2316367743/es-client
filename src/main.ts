import {createApp} from 'vue';
import store from "@/store";
import App from './App.vue';
import i18n from '@/i18n';
import {applicationLaunch} from "@/global/BeanFactory";

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

// 引入样式
import '@/less/theme.less';
import '@/less/main.less';
import '@/less/post.css'

// arco样式
import '@arco-design/web-vue/es/spin/style/css.js';
import '@arco-design/web-vue/es/message/style/css.js';
import '@arco-design/web-vue/es/notification/style/css.js';

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
    .use(store)
    .use(i18n)
    .use(ArcoVueIcon)
    .use(VXETable)
    .mount('#app');

applicationLaunch.executeInit();
