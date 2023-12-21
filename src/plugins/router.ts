import {createRouter, createWebHashHistory} from 'vue-router';
import PageNameEnum from "@/enumeration/PageNameEnum";
// 引入路由

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        name: "首页",
        path: '/',
        redirect: '/home'
    }, {
        name: '主页',
        path: '/home',
        component: () => import('@/page/home/index.vue')
    }, {
        name: '数据查询',
        path: '/data-browse',
        component: () => import('@/page/data-browse/index.vue')
    }, {
        name: '基础查询',
        path: '/base-search',
        component: () => import('@/page/base-search/index.vue')
    }, {
        name: '高级查询',
        path: '/senior-search',
        component: () => import('@/page/senior-search/index.vue')
    }, {
        name: '工具',
        path: PageNameEnum.TOOL,
        component: () => import('@/page/dashboard/index.vue'),
        children: [{
            name: '观察者',
            path: 'watch',
            component: () => import('@/page/tool/watch/index.vue')
        }, {
            name: 'sql',
            path: 'sql',
            component: () => import('@/page/tool/sql/index.vue')
        }]
    }, {
        name: '仪表盘',
        path: PageNameEnum.DASHBOARD,
        component: () => import('@/page/dashboard/index.vue'),
        children: [{
            name: '信息',
            path: 'info',
            component: () => import('@/page/dashboard/info/index.vue')
        }, {
            name: '节点',
            path: 'node',
            component: () => import('@/page/dashboard/node/index.vue')
        }, {
            name: '副本与分片',
            path: 'shard-and-replica',
            component: () => import('@/page/dashboard/ShardAndReplica/index.vue')
        }, {
            name: '_cat',
            path: 'cat',
            component: () => import('@/page/dashboard/Cat/index.vue')
        }, {
            name: '分析',
            path: 'analysis',
            component: () => import('@/page/dashboard/Analysis/index.vue')
        }]
    }, {
        name: '设置',
        path: '/setting',
        component: () => import('@/page/setting/index.vue'),
        redirect: '/setting/global',
        children: [{
            name: '全局设置',
            path: 'global',
            component: () => import('@/page/setting/components/global.vue')
        }, {
            name: '高级查询过滤器',
            path: 'senior-filter-record',
            component: () => import('@/page/setting/components/senior-filter-record/index.vue')
        }, {
            name: '链接管理',
            path: 'url',
            component: () => import('@/page/setting/components/url.vue')
        }, {
            name: '备份设置',
            path: 'backup',
            component: () => import('@/page/setting/components/backup/index.vue')
        }]
    }, {
        name: '更多',
        path: '/more',
        component: () => import('@/page/more/index.vue'),
        children: [{
            name: '更新日志',
            path: '/more/update',
            component: () => import('@/page/more/components/update.vue')
        }, {
            name: '隐私协议',
            path: '/more/privacy',
            component: () => import('@/page/more/components/privacy.vue')
        }, {
            name: '关于',
            path: '/more/about',
            component: () => import('@/page/more/components/about.vue')
        }]
    }]
});

export default router;
