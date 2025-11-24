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
  },
  logs: UpdateLog,
  isSupportPin: true,
  url: {
    home: 'https://es-client.esion.xyz',
    author: 'https://blog.esion.xyz',
    feedback: 'https://es-client.esion/feedback/open'
  },
  doc: {
    index: 'https://es-client.esion.xyz/docs/open',
    dataBrowse: 'https://www.yuque.com/baozhiyige-tewwf/ygxv4r/fcqkthtec4u90hgz'
  }
}
