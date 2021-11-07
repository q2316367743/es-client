import Vue from 'vue'
import Router from 'vue-router'

import home from "@/pages/home/home";
import index from "@/pages/index/index";
import data from "@/pages/data/data";

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'domain',
        nickname: '首页',
        component: home
    }, {
        path: '/home',
        name: 'home',
        component: home
    }, {
        path: '/index',
        name: 'index',
        component: index
    }, {
        path: '/data',
        name: 'data',
        component: data
    }]
})