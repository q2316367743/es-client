import axios from 'axios';

/**
 * 与集群相关的API
 */
export default {
    info(success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
    _stats(success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
    _cluster_state(success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
    _nodes_stats(success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
    _nodes_plugins(success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
}