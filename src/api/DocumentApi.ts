import {httpStrategyContext} from "@/global/BeanFactory";

/**
 * 与索引有关的API
 */
export default function DocumentApi(index: string) {
    return {
        _search(data?: any): Promise<any> {
            return httpStrategyContext.getStrategy().es<any>({
                url: `/${index}/_search`,
                method: "POST",
                data: data || {}
            })
        },

        _insert(data: string): Promise<any> {
            return httpStrategyContext.getStrategy().es<any>({
                url: `/${index}/_doc`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        _delete_by_query(data: any): Promise<any> {
            return httpStrategyContext.getStrategy().es<any>({
                url: `/${index}/_delete_by_query`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        _update(id: string, data: any): Promise<any> {
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
}