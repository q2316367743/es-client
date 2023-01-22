import {IndexInstance} from '@/domain/IndexInstance';
import {httpStrategyContext} from "@/global/BeanFactory";
import IndexCreateBuild from '@/build/IndexCreateBuild';

/**
 * 与索引有关的API
 */
export default {
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