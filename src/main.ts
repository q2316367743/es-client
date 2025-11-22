import store from "@/store";
import AppInstance from './App.vue';
import router from "@/plugins/router";

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

// 引入样式
import '@/assets/less/theme.less';
import '@/assets/less/main.less';
import '@/assets/less/post.css';
import '@/assets/less/customer.less';
import '@/components/view/JsonTreeView/index.less';
import '@arco-design/web-vue/dist/arco.css';
import 'vxe-table/lib/style.css'

// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
// import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import XEUtils from 'xe-utils'
import {Column, VxeTable, VxeUI,} from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import {registerLanguageForHttp} from "@/components/rest-client-editor";
import {App} from "vue";
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
    // if (['typescript', 'javascript'].includes(label)) {
    //     return new TsWorker()
    // }
    return new EditorWorker()
  }
};

// 注册语言服务器
registerLanguageForHttp()

// 引入VXETable
// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VxeUI.setConfig({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})

function useTable(app: App) {
  // 表格功能

  // 可选组件
  app.use(Column)

    // 安装表格
    .use(VxeTable)
}

// 插件
createApp(AppInstance)
  .use(store)
  .use(ArcoVueIcon)
  .use(router)
  .use(useTable)
  .mount('#app');

// 变量挂载
window.mode = import.meta.env.VITE_MODE;
window.referrer = import.meta.env.VITE_REFERRER;
