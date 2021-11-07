import Vue from 'vue'
import Router from 'vue-router'

import home from "@/pages/home/home";
import index from "@/pages/index/index";
import data from "@/pages/data/data";
import base_search from "@/pages/base_search/base_search";
import senior_search from "@/pages/senior_search/senior_search";

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
    }, {
        path: '/base_search',
        name: 'base_search',
        component: base_search
    }, {
        path: '/senior_search',
        name: 'senior_search',
        component: senior_search
    }]
})