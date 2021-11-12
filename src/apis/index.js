import axios from 'axios';

/**
 * 与索引有关的API
 */
export default {
    new_alias(index, alias, success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
            method: 'POST',
            url: '_aliases',
            data: {"actions": [{"add": {"index": index, "alias": alias}}]}
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
    remove_alias(index, alias, success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
            method: 'POST',
            url: '_aliases',
            data: {"actions": [{"remove": {"index": index, "alias": alias}}]}
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
    _refresh(index, success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
            method: 'POST',
            url: `${index}/_refresh`,
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
    save(data, success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
    remove(index, success, error) {
        axios({
            baseURL: localStorage.getItem('url'),
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
    }
}