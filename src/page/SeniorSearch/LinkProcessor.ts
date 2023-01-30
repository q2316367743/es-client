import useIndexStore from "@/store/IndexStore";


import {optionsForGet, optionsForPost, signs} from '@/data/EsUrl';

/**
 * 链接处理器
 * @param target 目标链接
 * @param method 请求方式
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
        fields.map(e => optionsForGet.map(o => `/${e}/${o}`))
            .flat()
            .forEach(f => links.push(f));
        signs.forEach(s => links.push(s));
    } else if (method === 'POST') {
        let fields = buildFieldList();
        fields.map(e => optionsForPost.map(o => `/${e}/${o}`))
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