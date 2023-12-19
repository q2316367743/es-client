import {DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";
import {fetchEs} from "@/plugins/native/axios";
import {DocumentSearchResult} from "@/components/es/domain/DocumentSearchResult";
import {Analyze} from "@/components/es/domain/Analyze";

/**
 * 与索引有关的API
 */
export default function DocumentApi(index: string) {
    return {
        _search(data?: DocumentSearchQuery): Promise<DocumentSearchResult<any>> {
            return fetchEs<DocumentSearchResult<DocumentSearchResult<any>>>({
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
        },
        _search_first(data: DocumentSearchQuery, time: string): Promise<DocumentSearchResult> {
            return fetchEs<DocumentSearchResult>({
                url: `/${index}/_search`,
                method: "POST",
                data: data,
                params: {
                    scroll: time
                }
            })
        },
        _search_scroll(time: string, scroll_id: string): Promise<DocumentSearchResult<any>> {
            return fetchEs<DocumentSearchResult<any>>({
                url: '/_search/scroll',
                method: "POST",
                data: {
                    scroll: time,
                    scroll_id: scroll_id
                }
            })
        },
        _analyze(field: string, text: string): Promise<Analyze> {
            return fetchEs<Analyze>({
                url: `/${index}/_analyze`,
                method: 'POST',
                data: {text, field}
            })
        }
    }
}
