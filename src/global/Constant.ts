import {Repository} from "@/view/Data";
import UpdateLog from '@/data/UpdateLog'
import PluginModeEnum from "@/enumeration/PluginModeEnum";

const mode: PluginModeEnum = import.meta.env.VITE_MODE as PluginModeEnum;

export default {
    uid: "z1f3vu4k",
    name: "es-client",
    version: UpdateLog[0].version,
    sign: UpdateLog[0].sign,
    build: UpdateLog[0].time,
    author: "Esion",
    email: 'm17762618644@163.com',
    mode,
    homeUrl: 'https://blog.esion.xyz',
    docUrl: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r',
    statistics: "http://project-esion.nat300.top",
    updateUrl: 'https://es-client.esion.xyz/electron/update.json',
    repositories: [{
        name: "Gitee",
        url: "https://gitee.com/qiaoshengda/es-client"
    }, {
        name: 'Github',
        url: 'https://github.com/q2316367743/es-client'
    }] as Repository[],
    // 分发平台
    distributes: {
        'chrome': 'https://chromewebstore.google.com/detail/es-client/pkhmgepniefdigphghbolofjgbnhnhfd',
        'edge': 'https://microsoftedge.microsoft.com/addons/detail/esclient/aonamamifdfigcflbeokdndfappnmogo',
        'firefox': 'https://addons.mozilla.org/zh-CN/firefox/addon/es-client/',
        '想天浏览器': 'https://a.apps.vip/d.appStore/index.html#/share?id=NdAH5w',
        'utools': 'https://u.tools/plugins/detail/es-client/'
    },
    txc: 'https://support.qq.com/products/489458',
    logs: UpdateLog,
    isSupportPin: true,
    doc: {
        dataBrowse: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r/fcqkthtec4u90hgz'
    }
}
