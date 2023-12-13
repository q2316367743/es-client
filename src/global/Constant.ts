import {Repository} from "@/view/Data";
import UpdateLog from '@/data/UpdateLog'
import PluginModeEnum from "@/enumeration/PluginModeEnum";


export default {
    uid: "z1f3vu4k",
    name: "es-client",
    version: UpdateLog[0].version,
    sign: UpdateLog[0].sign,
    build: UpdateLog[0].time,
    author: "Esion",
    email: 'm17762618644@163.com',
    // @ts-ignore
    mode: import.meta.env.VITE_MODE as PluginModeEnum,
    // @ts-ignore
    feedback: import.meta.env.VITE_FEEDBACK_URL,
    homeUrl: 'https://blog.esion.xyz',
    docUrl: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r',
    statistics: "http://project-esion.nat300.top",
    repositories: [{
        name: "Gitee",
        url: "https://gitee.com/qiaoshengda/es-client"
    }, {
        name: 'Github',
        url: 'https://github.com/q2316367743/es-client'
    }] as Repository[],
    // 分发平台
    distributes: {
        'edge': 'https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo',
        'firefox': 'https://addons.mozilla.org/zh-CN/firefox/addon/es-client/',
        '想天浏览器': 'https://a.apps.vip/d.appStore/index.html#/share?id=NdAH5w',
        'utools': 'https://open.u-tools.cn/14220.html'
    },
    txc: 'https://support.qq.com/products/489458',
    logs: UpdateLog,
    updater: "https://static.esion.xyz/share/es-client/update.json"
}
