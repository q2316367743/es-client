import { useUrlStore } from '@/store/UrlStore';
import axios from '@/plugins/axios'

import { Info } from '@/view/Info'

/**
 * 与集群相关的API
 */
export default {
    info(success: (data: Info) => void, error?: (e: Error) => void): void {
        const url = useUrlStore().current;
        axios({
            baseURL: url,
            method: 'GET',
            url: '/'
        }).then(response => {
            success(response.data);
        }).catch(e => {
            if (error) {
                error(e);
            }
        })
    },
}