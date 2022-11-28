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
        if (temps.length != 2) {
            continue;
        }
        condition.sort[temps[0].trim()] = {
            order: temps[1].trim()
        }
    }
}

/**
 * where语句构造
 * 
 * 条件支持：[=],[!=],[>],[>=],[<],[<=]
 * 链接符号支持：[and],[or]
 * 
 * @param where where条件
 * @param condition 查询条件
 */
function whereBuild(must: string, should: string, mustNot: string, condition: any) {

}

function templateBuild(template: string, condition: any): void {
    let items = template.split(',');
    for(let item of items) {
        // 每一项：[key]{条件}[value]([and|or] [key]{条件}[value])
    }
}