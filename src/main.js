import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'less'
import './main.less'
import codemirror from "vue-codemirror";

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(codemirror)

new Vue({
    render: h => h(App),
}).$mount('#app')