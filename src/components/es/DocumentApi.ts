import {DocumentSearchQuery} from "@/domain/es/DocumentSearchQuery";
import {useEsRequest, useEsRequestJson} from "@/plugins/native/axios";
import {DocumentSearchResult} from "@/domain/es/DocumentSearchResult";
import {Analyze} from "@/domain/es/Analyze";

/**
 * 与索引有关的API
 * @todo 此处需要考虑版本的影响
 */
export default function DocumentApi(index: string) {
  return {
    _search(data?: DocumentSearchQuery): Promise<string> {
      return useEsRequest({
        url: `/${index}/_search`,
        method: "POST",
        data: data
      })
    },

    _insert(data: string): Promise<any> {
      return useEsRequestJson<any>({
        url: `/${index}/_doc`,
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data
      })
    },
    _delete_by_query(data: Record<string, any>): Promise<any> {
      return useEsRequestJson<any>({
        url: `/${index}/_delete_by_query`,
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data
      })
    },
    _update(id: string, data: string): Promise<any> {
      return useEsRequestJson<any>({
        url: `/${index}/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        data
      })
    },
    _search_first(data: DocumentSearchQuery, time: string): Promise<DocumentSearchResult> {
      return useEsRequestJson<DocumentSearchResult>({
        url: `/${index}/_search`,
        method: "POST",
        data: data,
        params: {
          scroll: time
        }
      })
    },
    _search_scroll(time: string, scroll_id: string): Promise<DocumentSearchResult<any>> {
      return useEsRequestJson<DocumentSearchResult<any>>({
        url: '/_search/scroll',
        method: "POST",
        data: {
          scroll: time,
          scroll_id: scroll_id
        }
      })
    },
    _analyze(field: string, text: string): Promise<Analyze> {
      return useEsRequestJson<Analyze>({
        url: `/${index}/_analyze`,
        method: 'POST',
        data: {text, field}
      })
    }
  }
}
