import store from "@/store";
import AppInstance from './App.vue';
import router from "@/plugins/router";
import "@/assets/less"
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 引入样式
import '@/components/view/JsonTreeView/index.less';
import '@arco-design/web-vue/dist/arco.css';
// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import {registerLanguageForHttp} from "@/components/rest-client-editor";
// vxe-ui
import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'
// vxe-table
import VxeUITable from 'vxe-table'
import 'vxe-table/es/style.css'
// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = { // 提供一个定义worker路径的全局变量
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new JsonWorker()
    }
    return new EditorWorker()
  }
};

// 注册语言服务器
registerLanguageForHttp()


// 插件
createApp(AppInstance)
  .use(store)
  .use(ArcoVueIcon)
  .use(router)
  .use(VxeUIBase).use(VxeUITable)
  .mount('#app');

// 变量挂载
window.mode = import.meta.env.VITE_MODE;
window.referrer = import.meta.env.VITE_REFERRER;
