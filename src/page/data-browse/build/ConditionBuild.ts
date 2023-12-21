import {SortConditionType} from "@/components/es/domain/DocumentSearchQuery";
import {ConditionItem, SortItem} from "@/page/data-browse/domain/DbConditionItem";
import MessageUtil from "@/utils/MessageUtil";


/**
 * 排序构造
 * [asc],[desc]，[,]分割
 *
 * @param orderBy 排序语句
 */
export function orderByBuild(orderBy: string): Array<SortItem> {
    const condition = new Array<SortItem>();
    if (!orderBy || orderBy === '') {
        return condition;
    }
    // 根据[,]分割
    let items = orderBy.split(',');
    for (let item of items) {
        if (item === '') {
            continue;
        }
        // 根据空格分割
        let temps = item.split(' ');
        if (temps.length > 2 || temps.length < 1) {
            continue;
        }
        if (temps.length == 2) {
            condition.push({
                field: temps[0].trim(),
                type: temps[1].trim() as SortConditionType
            })
        } else {
            condition.push({
                field: temps[0].trim(),
                type: 'asc'
            })
        }
    }
    return condition;
}


const CONDITION = new Set<string>(['>', '<', '=']);

/**
 * 条件模板构造器
 * @param template 模板
 * @return 条件
 */
export function templateBuild(template: string): Array<ConditionItem> {
    const condition = new Array<ConditionItem>()

    let items = template.split(',');
    for (let item of items) {
        // 去除空格
        item = item.trim();
        if (!item || item === '') {
            continue;
        }
        // 每一项：[key]{条件}[value]([and|or] [key]{条件}[value])
        let models = parseCondition(item);
        // 最基本的 key [=|match|>=|>|<|<= value];
        let model = models[1];
        if (model === '=') {
            condition.push({
                field: models[0],
                type: 'term',
                value: models[2]
            });
        } else if (model === 'match') {
            // term
            let match = {} as any;
            match[models[0]] = models[2];
            condition.push({
                field: models[0],
                type: 'match',
                value: models[2]
            });
        } else {

            const range: ConditionItem = {
                field: models[0],
                type: 'range',
                value: models[2]
            };

            if (model === '>') {
                range.expand = 'gt';
            } else if (model === '<') {
                range.expand = 'lt';
            } else if (model === '>=') {
                range.expand = 'gte';
            } else if (model === '<=') {
                range.expand = 'lte';
            }
            condition.push(range)
        }
    }
    console.log(template, condition)
    return condition;
}

function parseCondition(condition: string): string[] {
    let items = [];
    let item = '';
    // 是否是条件
    let isSep = false;
    // 是否是引号
    let isBlock = false
    for (let i = 0; i < condition.length; i++) {
        let char = condition.charAt(i);
        if (char === '\'') {
            if (i > 0 && condition.charAt(i - 1) === '\\') {
                // 转义
                item = item.substring(0, item.length - 1)
                item += char;
            } else if (isBlock) {
                if (item !== '') {
                    items.push(item);
                }
                item = '';
                isBlock = false;
            } else {
                if (item !== '') {
                    items.push(item);
                }
                item = '';
                isBlock = true;
            }
        } else if (isBlock) {
            item += char;
        } else if (CONDITION.has(char)) {
            if (isSep) {
                item += char;
            } else {
                if (item !== '') {
                    items.push(item);
                }
                item = char;
                isSep = true;
            }
        } else if (char === ' ') {
            if (item !== '') {
                items.push(item);
            }
            item = '';
        } else {
            if (isSep) {
                if (item !== '') {
                    items.push(item);
                }
                item = char;
            } else {
                item += char;
            }
            if (isSep) {
                isSep = false;
            }
        }
    }

    if (item) {
        items.push(item);
    }
    return items;
}

/**
 * 将条件字符串转换成数组
 * @param items 条件
 */
export function templateRender(items: Array<ConditionItem>): string {
    return items.map(e => {
        if (e.type === 'term') {
            return `${e.field}='${e.value}'`;
        } else if (e.type === 'match') {
            return `${e.field} match '${e.value}'`;
        }
    }).join(',');
}

/**
 * 条件渲染
 * @param items
 */
export function conditionRender(items: Array<ConditionItem>): Array<Record<string, any>> {
    return items.map(item => {
        const obj: Record<string, any> = {};
        const con: Record<string, any> = {};
        con[item.field] = item.value;
        obj[item.type] = con;
        return obj;
    })
}

export function conditionConvert(items: Array<ConditionItem>): string {
    return items.map(item => {
        if (item.type === 'term') {
            return `${item.field}='${item.value}'`;
        } else if (item.type === 'match') {
            return `${item.field} match ${item.value}`;
        } else if (item.type === 'range') {
            // TODO: 此处需要处理
            return `${item.field} ${item.expand} ${item.value}`;
        } else {
            MessageUtil.warning("解析异常，条件解析失败")
            return ""
        }
    }).filter(e => e.trim() !== '').join(",")
}

export function orderByRender(items: Array<SortItem>): Record<string, any> {
    const obj: Record<string, any> = {}
    for (let item of items) {
        obj[item.field] = {
            order: item.type
        };
    }
    return obj;
}

export function orderByConvert(items: Array<SortItem>): string {
    return items.map(item => `${item.field} ${item.type}`).join(",");
}
