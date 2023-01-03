let a = {
    "query": {
        "bool": {
            "must": [
                {
                    "term": {
                        "customer_user_info.qq": "82169840"
                    }
                }
            ],
            "must_not": [],
            "should": []
        }
    },
    "from": 0,
    "size": 30,
    "sort": {
        "id": {
            "order": "asc"
        }
    },
    "aggs": {}
}


/**
 * 构造查询条件
 *
 * must、should、mustNot，条件支持：[=],[!=],[>],[>=],[<],[<=]；[,]分割；链接符号支持：[and],[or]
 * orderBy：[asc],[desc]，[,]分割
 *
 * @param must    must条件
 * @param should  should条件
 * @param mustNot must_not条件
 * @param orderBy 排序
 * @param page    第几页
 * @param size    每页大小
 */
export default function ConditionBuild(must: string, should: string, mustNot: string, orderBy: string, page: number, size: number): any {
    let condition = {
        from: (page - 1) * size,
        size: size,
        sort: {},
        query: {
            bool: {
                must: [],
                must_not: [],
                should: []
            }
        }
    };
    // 条件构造
    whereBuild(must, should, mustNot, condition);
    // 排序构造
    orderByBuild(orderBy, condition);
    // 返回结果集
    return condition;
}

/**
 * 排序构造
 * [asc],[desc]，[,]分割
 *
 * @param orderBy 排序语句
 * @param condition 条件
 */
function orderByBuild(orderBy: string, condition: any) {
    if (!orderBy || orderBy === '') {
        return;
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
            condition.sort[temps[0].trim()] = {
                order: temps[1].trim()
            }
        } else {
            condition.sort[temps[0].trim()] = {
                order: 'asc'
            }
        }
    }
}

/**
 * where语句构造
 *
 * 条件支持：[=],[!=],[>],[>=],[<],[<=]
 * 链接符号支持：[and],[or]
 *
 * @param must must条件
 * @param should should
 * @param mustNot mustNot
 * @param condition 查询条件
 */
function whereBuild(must: string, should: string, mustNot: string, condition: any) {
    if (must) {
        templateBuild(must, condition.query.bool.must)
    }
    if (should) {
        templateBuild(should, condition.query.bool.should)
    }
    if (mustNot) {
        templateBuild(mustNot, condition.query.bool.must_not)
    }
}

const CONDITION = new Set<string>(['>', '<', '=']);

function templateBuild(template: string, condition: Array<any>): void {
    let items = template.split(',');
    for (let item of items) {
        // 每一项：[key]{条件}[value]([and|or] [key]{条件}[value])
        let models = parseCondition(item);
        if (models.length === 3) {
            let model = models[1];
            if (model === '=') {
                // term
                let term = {} as any;
                term[models[0]] = models[2];
                condition.push({
                    term
                });
            }else {
                // TODO: >，<，>=，<=
                let range = {} as any;
                if (model === '>') {
                    range[models[0]] = {
                        gt: models[2]
                    };
                }else if (model === '<') {
                    range[models[0]] = {
                        lt: models[2]
                    };
                }else if (model === '>=') {
                    range[models[0]] = {
                        gte: models[2]
                    };
                }else if (model === '<=') {
                    range[models[0]] = {
                        lte: models[2]
                    };
                }
                condition.push({
                    range
                })
            }
        } else if (models.length === 7) {
            // TODO: >，<，>=，<=
            let range = {} as any;
            range[models[0]] = {}
            let model1 = models[1];
            let model2 = models[5];
            if (model1 === '>') {
                range[models[0]]['gt'] = models[2];
            }else if (model1 === '<') {
                range[models[0]]['lt'] = models[2];
            }else if (model1 === '>=') {
                range[models[0]]['gte'] = models[2];
            }else if (model1 === '<=') {
                range[models[0]]['lte'] = models[2];
            }
            if (model2 === '>') {
                range[models[0]]['gt'] = models[6];
            }else if (model2 === '<') {
                range[models[0]]['lt'] = models[6];
            }else if (model2 === '>=') {
                range[models[0]]['gte'] = models[6];
            }else if (model2 === '<=') {
                range[models[0]]['lte'] = models[6];
            }
            condition.push({
                range
            })
        }
    }
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