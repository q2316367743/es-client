import Index from '@/view/Index';
import SearchSchemaBuild from './SearchSchemaBuild';
import DocSchemaBuild from './DocSchemaBuild';

interface SChema {

    /**
     * The URI of the schema, which is also the identifier of the schema.
     */
    readonly uri: string;
    /**
     * A list of glob patterns that describe for which file URIs the JSON schema will be used.
     * '*' and '**' wildcards are supported. Exclusion patterns start with '!'.
     * For example '*.schema.json', 'package.json', '!foo*.schema.json', 'foo/**\/BADRESP.json'.
     * A match succeeds when there is at least one pattern matching and last matching pattern does not start with '!'.
     */
    readonly fileMatch?: string[];
    /**
     * The schema for the given URI.
     */
    readonly schema?: any;

}

const default_schema = {
    "$id": "schema_search.json",
    "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
    "type": "object",
    "properties": {}
}

export default function TipsBuild(indices: Array<Index>, link: string): SChema[] {
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
        let fields = new Array<string>();
        if (index) {
            index.fields.forEach(i => fields.push(i.name.substring(5)));
        }
        return SearchSchemaBuild(fields);
    }else if (link.indexOf('_doc') > -1) {
        return DocSchemaBuild(index);
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