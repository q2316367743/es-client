import {Repository} from "@/view/Data";
import UpdateLog from '@/data/UpdateLog'


export default {
    name: "es-client",
    version: UpdateLog[0].version,
    build: UpdateLog[0].time,
    author: "Esion",
    email: 'm17762618644@163.com',
    // @ts-ignore
    platform: import.meta.env.VITE_PLATFORM,
    // @ts-ignore
    mode: import.meta.env.VITE_MODE,
    // @ts-ignore
    storage: import.meta.env.VITE_STORAGE,
    homeUrl: 'https://blog.esion.xyz',
    docUrl: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r',
    repositories: [{
        name: "Gitee",
        url: "https://gitee.com/qiaoshengda/es-client"
    }, {
        name: 'Github',
        url: 'https://github.com/q2316367743/es-client'
    }, {
        name: 'GitLink',
        url: 'https://www.gitlink.org.cn/m17762618644/es-client'
    }] as Repository[],
    // 分发平台
    distributes: {
        'edge': 'https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo',
        'firefox': 'https://addons.mozilla.org/zh-CN/firefox/addon/es-client/',
        '想天浏览器': 'https://a.apps.vip/d.appStore/index.html#/share?id=NdAH5w'
    },
    // @ts-ignore
    feedback: import.meta.env.VITE_FEEDBACK_URL,
    txc: 'https://support.qq.com/products/489458',
    logs: UpdateLog
}