import axios from 'axios';
import { useUrlStore } from '@/store/UrlStore';

import { Info } from '@/view/Info'

/**
 * 与集群相关的API
 */
export default {
    info(success: (data: Info) => void, error?: (e: Error) => void): void {
        const url = useUrlStore().current;
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
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
}