import {IndexCreate} from "@/domain/es/IndexCreate";
import IndexHealth from "@/domain/es/IndexHealth";
import {useEsRequestJson} from "@/plugins/native/axios";

/**
 * 与索引有关的API
 *
 * @param name 索引名称
 * @todo 考虑版本影响
 */
export default function (name: string) {
  return {
    /**
     * 创建索引
     *
     * @param data 索引信息
     */
    create(data: IndexCreate): Promise<any> {
      return useEsRequestJson<any>({
        method: 'PUT',
        url: '/' + name,
        data
      })
    },
    /**
     * 删除索引
     */
    delete(): Promise<any> {
      return useEsRequestJson<any>({
        method: 'DELETE',
        url: '/' + name,
      })
    },
    /**
     * 获取索引信息
     */
    info(): Promise<any> {
      return Promise.resolve();
    },
    /**
     * 获取索引状态
     */
    _stats(): Promise<any> {
      return useEsRequestJson({
        method: 'GET',
        url: `/${name}/_stats`
      });
    },
    /**
     * 获取索引设置
     */
    _settings(): Promise<any> {
      return useEsRequestJson({
        method: 'GET',
        url: `/${name}/_settings`
      })
    },
    _mappings(): Promise<any> {
      return useEsRequestJson({
        method: 'GET',
        url: `/${name}/_mappings`
      })
    },
    health(): Promise<IndexHealth> {
      return useEsRequestJson({
        method: 'GET',
        url: `/_cluster/health/${name}`
      })
    },
    _cacheClear(): Promise<any> {
      return useEsRequestJson({
        method: 'POST',
        url: `/${name}/_cache/clear`
      });
    },
    /**
     * 为索引新建别名
     * @param alias 别名
     */
    newAlias(alias: string): Promise<any> {
      return useEsRequestJson<any>({
        method: 'POST',
        url: '/_aliases',
        data: {"actions": [{"add": {"index": name, "alias": alias}}]}
      });
    },
    /**
     * 移除索引
     * @param alias 别名
     */
    removeAlias(alias: string): Promise<any> {
      return useEsRequestJson<any>({
        method: 'POST',
        url: '/_aliases',
        data: {"actions": [{"remove": {"index": name, "alias": alias}}]}
      });
    },
    /**
     * 刷新索引
     */
    _refresh(): Promise<any> {
      return useEsRequestJson<any>({
        method: 'POST',
        url: `/${name}/_refresh`,
      })
    },
    /**
     * 关闭索引
     */
    _close(): Promise<any> {
      return useEsRequestJson<any>({
        method: 'POST',
        url: `/${name}/_close`,
      });
    },
    /**
     * 打开索引
     */
    _open(): Promise<any> {
      return useEsRequestJson<any>({
        method: 'POST',
        url: `/${name}/_open`,
      })
    },
    /**
     * flush索引
     */
    _flush(): Promise<any> {
      return useEsRequestJson<any>({
        method: 'POST',
        url: `/${name}/_flush`,
      })
    },
  }
}
