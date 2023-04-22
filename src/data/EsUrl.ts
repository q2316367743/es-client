export const supportMethods = ['HEAD', 'head', 'GET', 'get', 'POST', 'post', 'PUT', 'put', 'DELETE', 'delete'];

export const optionsForGet = ['', '_search', '_mapping'];
export const optionsForPost = ['_doc', '_search', '_setting', '_mapping'];

export const signs = ['/', '/_cluster/settings', '/_cat/allocation?v', '/_cat/shards?v', '/_cat/shards/', '/_cat/master?v',
    '/_cat/nodes?v', '/_cat/indices?v', '/_cat/indices/', '/_cat/segments?v', '/_cat/segments/', '/_cat/count',
    '/_cat/count/', '/_cat/recovery?v', '/_cat/recovery/', '/_cat/health?v', '/_cat/pending_tasks?v', '/_cat/aliases?v',
    '/_cat/aliases/', '/_cat/thread_pool?v', '/_cat/plugins?v', '/_cat/fielddata?v', '/_cat/fielddata/', '/_cat/nodeattrs?v',
    '/_cat/repositories?v', '/_cat/snapshots/', '/_cat/allocation?help', '/_cat/shards?help', '/_cat/shards/', '/_cat/master?help',
    '/_cat/nodes?help', '/_cat/indices?help', '/_cat/indices/', '/_cat/segments?help', '/_cat/segments/', '/_cat/count',
    '/_cat/count/', '/_cat/recovery?help', '/_cat/recovery/', '/_cat/health?help', '/_cat/pending_tasks?help', '/_cat/aliases?help',
    '/_cat/aliases/', '/_cat/thread_pool?help', '/_cat/plugins?help', '/_cat/fielddata?help', '/_cat/fielddata/', '/_cat/nodeattrs?help',
    '/_cat/repositories?help', '/_cat/snapshots/'];

// URL正则匹配
export const URL_REGEX = /^\s*(HEAD|head|GET|get|POST|post|PUT|put|DELETE|delete)\s+(.+)\s*/;
export const JSON_REGEX = /^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/;
export const COMMENT_REGEX = /^\s*\/\/.*/;
export const BLANK_REGEX = /^\s*$/;