import Index from '@/view/Index';
import SChema from '@/entity/SChema';
import StrategyContext from '../strategy/StrategyContext';

const default_schema = {
    "$id": "schema_search.json",
    "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
    "type": "object",
    "properties": {}
}

export default function SchemaBuild(indices: Array<Index>, link: string): SChema[] {
    return [
        {
            uri: 'https://esion.xyz/assert/es-client/schema.json',
            fileMatch: ['*'],
            schema: schemaBuild(indices, link)
        },
    ]
}

// schema指南: https://www.cnblogs.com/terencezhou/p/10474617.html

function schemaBuild(indices: Array<Index>, link: string): any {
    let index = parseLink(indices, link);
    if (!index) {
        return default_schema;
    }
    if (link.indexOf('_search') > -1) {
        return StrategyContext.getStrategy('_search').issue(index);
    } else if (link.indexOf('_doc') > -1) {
        return StrategyContext.getStrategy('_doc').issue(index);
    }
    return default_schema;
}

/**
 * 解析链接中的索引名称
 * 
 * @param indices 全部的索引
 * @param link 当前链接
 */
function parseLink(indices: Array<Index>, link: string): Index | undefined {
    if (link === '') {
        return;
    }
    for (let index of indices) {
        if (link.indexOf(index.name) > -1) {
            return index;
        }
        for (let alias of index.alias) {
            if (link.indexOf(alias)) {
                return index;
            }
        }
    }
}