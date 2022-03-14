import Index from '@/view/Index';
import SChema from '@/entity/SChema';
import StrategyContext from '../strategy/StrategyContext';
import StrategyTypeEnum from '../strategy/enumeration/StrategyTypeEnum';

export default function SchemaBuild(indices: Array<Index>, url: string): SChema[] {
    return [
        {
            uri: 'https://esion.xyz/assert/es-client/schema.json',
            fileMatch: ['*'],
            schema: schemaBuild(indices, url)
        },
    ]
}

// schema指南: https://www.cnblogs.com/terencezhou/p/10474617.html

function schemaBuild(indices: Array<Index>, url: string): any {
    if (url === '') {
        return StrategyContext.getStrategy(StrategyTypeEnum.DEFAULT).issue({} as Index);
    }
    // 链接的每一个部分
    let links = url.split('/');
    // 过滤掉空字符串
    links = links.filter(l => l !== '');
    let link = links[0] || '';
    let option = links[1] || '';
    let index = parseLink(indices, link);
    if (!index) {
        return StrategyContext.getStrategy(StrategyTypeEnum.DEFAULT).issue({} as Index);
    }
    if (option.length > 0) {
        return StrategyContext.getStrategy(option).issue(index);
    } else {
        return StrategyContext.getStrategy(StrategyTypeEnum.DEFAULT).issue({} as Index);
    }
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
        if (link === index.name) {
            return index;
        }
        for (let alias of index.alias) {
            if (link === alias) {
                return index;
            }
        }
    }
}