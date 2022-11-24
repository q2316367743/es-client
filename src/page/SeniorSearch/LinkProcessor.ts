import useIndexStore from "@/store/IndexStore";

// 附加操作
const options_get = ['', '_search', '_mapping'];
const options_post = ['_doc', '_search', '_setting', '_mapping'];

// 独立操作
const sign = ['/', '/_cluster/settings', '/_cat/allocation?v', '/_cat/shards?v', '/_cat/shards/', '/_cat/master?v',
    '/_cat/nodes?v', '/_cat/indices?v', '/_cat/indices/', '/_cat/segments?v', '/_cat/segments/', '/_cat/count',
    '/_cat/count/', '/_cat/recovery?v', '/_cat/recovery/', '/_cat/health?v', '/_cat/pending_tasks?v', '/_cat/aliases?v',
    '/_cat/aliases/', '/_cat/thread_pool?v', '/_cat/plugins?v', '/_cat/fielddata?v', '/_cat/fielddata/', '/_cat/nodeattrs?v',
    '/_cat/repositories?v', '/_cat/snapshots/', '/_cat/allocation?help', '/_cat/shards?help', '/_cat/shards/', '/_cat/master?help',
    '/_cat/nodes?help', '/_cat/indices?help', '/_cat/indices/', '/_cat/segments?help', '/_cat/segments/', '/_cat/count',
    '/_cat/count/', '/_cat/recovery?help', '/_cat/recovery/', '/_cat/health?help', '/_cat/pending_tasks?help', '/_cat/aliases?help',
    '/_cat/aliases/', '/_cat/thread_pool?help', '/_cat/plugins?help', '/_cat/fielddata?help', '/_cat/fielddata/', '/_cat/nodeattrs?help',
    '/_cat/repositories?help', '/_cat/snapshots/'];

/**
 * 链接处理器
 * @param target 目标链接
 */
export default function LinkProcessor(target: string, method: string): Array<string> {
    // 构建基础
    let links = new Array<string>();
    // 如果没有输入，则不返回推荐
    if (target === '') {
        return links;
    }
    // 遍历全部的索引，构建基础链接
    let tempLinks = buildAllLink(method);
    for (let temp of tempLinks) {
        if (temp.indexOf(target) > -1) {
            links.push(temp);
        }
    }
    return links.splice(0, 50);
}

function buildAllLink(method: string): Array<string> {
    let links = new Array<string>();
    if (method === 'GET') {
        let fields = buildFieldList();
        // GET请求增加
        fields.map(e => options_get.map(o => `/${e}/${o}`))
            .flat()
            .forEach(f => links.push(f));
        sign.forEach(s => links.push(s));
    } else if (method === 'POST') {
        let fields = buildFieldList();
        fields.map(e => options_post.map(o => `/${e}/${o}`))
            .flat()
            .forEach(f => links.push(f));
    } else if (method === 'PUT') {
        let fields = buildFieldList(false);
        fields.map(e => links.push(`/${e}/`))
    } else if (method === 'DELETE') {
        let fields = buildFieldList(false);
        fields.map(e => links.push(`/${e}/`))
    }
    return links;
}

/**
 * 此处获取别名+链接名称
 * @returns 全部的链接
 */
function buildFieldList(include_alias: boolean = true): Array<string> {
    // 准备数据
    let indices = useIndexStore().list;
    let fields = new Array<string>();
    // 遍历数据
    for (let index of indices) {
        // 插入别名
        if (include_alias) {
            for (let alias of index.alias) {
                fields.push(alias);
            }
        }
        // 插入本身
        fields.push(index.name);
    }
    return fields;
}