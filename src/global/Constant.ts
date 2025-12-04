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
    feedback: 'https://es-client.esion.xyz/feedback/app/es-client-open',
    download: 'https://es-client.esion.xyz/download',
    price: 'https://es-client.esion.xyz/price'
  },
  doc: {
    index: 'https://es-client.esion.xyz/help/docs/list',
    dataBrowse: 'https://es-client.esion.xyz/help/docs/info/e2d96cbb-cff3-4925-8cd8-e1df06dba44b'
  },
  mbd: {
    // 年费，常规
    year: 'https://mbd.pub/o/bread/YZWZlp9vZw==',
    // 永久，活动
    active: 'https://mbd.pub/o/bread/YZWZmJdvZg=='
  }
}
