import { Index } from '@/view/Index';
import axios from '@/plugins/axios'

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
        axios({
            method: 'POST',
            url: '_aliases',
            data: { "actions": [{ "add": { "index": index, "alias": alias } }] }
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
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
        axios({
            method: 'POST',
            url: '_aliases',
            data: { "actions": [{ "remove": { "index": index, "alias": alias } }] }
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
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
        axios({
            method: 'POST',
            url: `${index}/_refresh`,
        }).then(response => {
            success(response);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
            }
        })
    },
    /**
     * 新建索引
     * @param data 索引信息
     * @param success 成功回调
     * @param error 失败回调
     */
    save(data: Index, success: (data: any) => void, error?: (e: Error) => void) {
        axios({
            method: 'PUT',
            url: data.name,
            data: {
                "settings": {
                    "number_of_shards": data.number_of_shards,
                    "number_of_replicas": data.number_of_replicas
                }
            }
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
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
        axios({
            method: 'DELETE',
            url: index,
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
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
        axios({
            method: 'POST',
            url: `${index}/_close`,
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
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
        axios({
            method: 'POST',
            url: `${index}/_open`,
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
            }
        })
    },
    /**
     * 刷新索引
     * 
     * @param index 索引名称
     * @param success 成功回调
     * @param error 失败回调
     */
    _flush(index: string, success: (data: any) => void, error?: (e: Error) => void) {
        axios({
            method: 'POST',
            url: `${index}/_flush`,
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            } else {
                console.log(e, e.response)
            }
        })
    }
}