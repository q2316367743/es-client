import {DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";
import {fetchEs} from "@/plugins/axios";
import {DocumentSearchResult} from "@/components/es/domain/DocumentSearchResult";

/**
 * 与索引有关的API
 */
export default function DocumentApi(index: string) {
    return {
        _search(data?: DocumentSearchQuery): Promise<any> {
            return fetchEs<DocumentSearchResult<any>>({
                url: `/${index}/_search`,
                method: "POST",
                data: data
            })
        },

        _insert(data: Record<string, any>): Promise<any> {
            return fetchEs<any>({
                url: `/${index}/_doc`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data
            })
        },
        _delete_by_query(data: Record<string, any>): Promise<any> {
            return fetchEs<any>({
                url: `/${index}/_delete_by_query`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data
            })
        },
        _update(id: string, data: Record<string, any>): Promise<any> {
            return fetchEs<any>({
                url: `/${index}/_doc/${id}`,
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                data
            })
        }
    }
}
