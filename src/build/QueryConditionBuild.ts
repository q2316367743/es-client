import BaseQuery from "@/entity/BaseQuery";

/**
 * 获取基础查询请求体
 * @returns 基础查询请求体
 */
function getBaseBody(from?: number, size?: number): any {
    if (!from) {
        from = 0;
    }
    if (!size) {
        size = 10;
    }
    return {
        query: {
            bool: {
                must: [],
                must_not: [],
                should: [],
            },
        },
        from: 0,
        size: 10,
        sort: [],
        aggs: {},
    };
}

function buildQuery(query: BaseQuery, array: Array<any>): void {
    let condition = {} as any;
    let expression = {} as any;
    // 不同的条件，查询方式和表达式不同
    expression[query.field] = query.value;
    condition[query.condition] = expression;
    array.push(condition);
}

/**
 * 构造es查询条件
 * 
 * @param querys 查询条件
 */
export default function QueruConditionBuild(querys: Array<BaseQuery>, from?: number, size?: number): any {
    let must = [] as Array<any>;
    let must_not = [] as Array<any>;
    let should = [] as Array<any>;
    for (let query of querys) {
        if (query.type === 'must') {
            buildQuery(query, must);
        } else if (query.type === 'must_not') {
            buildQuery(query, must_not);
        } else if (query.type === 'should') {
            buildQuery(query, should);
        }
    }
    let body = getBaseBody(from, size);
    body.query.must = must;
    body.query.must_not = must_not;
    body.query.should = should;
    return body;
}