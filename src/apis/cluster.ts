import axios from 'axios';

/**
 * 与集群相关的API
 */
export default {
    info(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
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
    _stats(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_stats',
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
    _cluster_state(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_cluster/state',
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
    _cluster_health(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_cluster/health',
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
    _nodes(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_nodes',
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
    _nodes_stats(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_nodes/stats',
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
    _nodes_plugins(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_nodes/plugins',
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
    _template(success: (data: object) => void, error?: (e: Error) => void) {
        let url = localStorage.getItem('url');
        if (!url) {
            throw new Error('URL为空，请选择URL');
        }
        axios({
            baseURL: url,
            method: 'GET',
            url: '_template',
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