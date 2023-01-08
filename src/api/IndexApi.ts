import {IndexInstance} from '@/domain/IndexInstance';
import {httpStrategyContext} from "@/global/BeanFactory";
import IndexSaveBuild from '@/build/IndexSaveBuild';

/**
 * 与索引有关的API
 */
export default {
    /**
     * 为索引新建别名
     * @param index 索引名称
     * @param alias 别名
     * @param success 成功回调
     * @param error 失败回调
     */
    new_alias(index: string, alias: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'POST',
            url: '_aliases',
            data: {"actions": [{"add": {"index": index, "alias": alias}}]}
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * 移除索引
     * @param index 索引名称
     * @param alias 别名
     * @param success 成功回调
     * @param error 失败回调
     */
    remove_alias(index: string, alias: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'POST',
            url: '_aliases',
            data: {"actions": [{"remove": {"index": index, "alias": alias}}]}
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * 刷新索引
     * @param index 索引名称
     * @param success 成功回调
     * @param error 失败回调
     */
    _refresh(index: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'POST',
            url: `${index}/_refresh`,
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * 新建索引
     * @param data 索引信息
     * @param success 成功回调
     * @param error 失败回调
     */
    save(data: IndexInstance, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'PUT',
            url: data.name,
            data: IndexSaveBuild(data)
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * 移除索引
     * @param index 索引名称
     * @param success 成功回调
     * @param error 失败回调
     */
    remove(index: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'DELETE',
            url: index,
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * 关闭索引
     * @param index 索引名称
     * @param success 成功回调
     * @param error 失败回调
     */
    _close(index: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'POST',
            url: `${index}/_close`,
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * 打开索引
     * @param index 索引名称
     * @param success 成功回调
     * @param error 失败回调
     */
    _open(index: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'POST',
            url: `${index}/_open`,
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },
    /**
     * flush索引
     *
     * @param index 索引名称
     * @param success 成功回调
     * @param error 失败回调
     */
    _flush(index: string, success: (data: any) => void, error?: (e: Error) => void) {
        httpStrategyContext.getStrategy().es<any>({
            method: 'POST',
            url: `${index}/_flush`,
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.error(e, e.response)
            }
        })
    },

    _search(index: string, data?: any): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            url: `/${index}/_search`,
            method: "POST",
            data: data || {}
        })
    },

    _insert(index: string, data: string): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            url: `/${index}/_doc`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
    },
    _delete_by_query(index: string, data: any): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            url: `/${index}/_delete_by_query`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
    },
    _update(index: string, id: string, data: any): Promise<any> {
        return httpStrategyContext.getStrategy().es<any>({
            url: `/${index}/_doc/${id}`,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
    }
}