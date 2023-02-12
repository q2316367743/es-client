import BaseQuery from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";

/**
 * 获取基础查询请求体
 * @returns 基础查询请求体
 */
function getBaseBody(page: number, size: number): any {
    return {
        query: {
            bool: {
                must: [],
                must_not: [],
                should: [],
            },
        },
        from: (page - 1) * size,
        size: size,
        sort: [],
        aggs: {},
    };
}

function buildQuery(query: BaseQuery, array: Array<any>): void {
    if (!query.field || query.field === '') {
        return;
    }
    let condition = {} as any;
    let expression = {} as any;
    let cod = query.condition;
    // 不同的条件，查询方式和表达式不同
    if (query.condition === 'match' ||
        query.condition === 'term' ||
        query.condition === 'wildcard') {
        expression[query.field.substring(5)] = query.value;
    } else if (query.condition === 'range_lt') {
        let value = {} as any;
        value['lt'] = query.value;
        expression[query.field.substring(5)] = value;
        cod = 'range';
    } else if (query.condition === 'range_lte') {
        let value = {} as any;
        value['lte'] = query.value;
        expression[query.field.substring(5)] = value;
        cod = 'range';
    } else if (query.condition === 'range_gt') {
        let value = {} as any;
        value['gt'] = query.value;
        expression[query.field.substring(5)] = value;
        cod = 'range';
    } else if (query.condition === 'range_gte') {
        let value = {} as any;
        value['gte'] = query.value;
        expression[query.field.substring(5)] = value;
        cod = 'range';
    } else {
        throw new Error('查询条件不支持')
    }
    condition[cod] = expression;
    array.push(condition);
}

function buildOrder(orders: Array<BaseOrder>, body: any) {
    body.sort = {};
    for (let order of orders) {
        if (order.field === '' || order.type === null) {
            continue;
        }
        body.sort[order.field.substring(5)] = {order: order.type};
    }
}

/**
 * 构造es查询条件
 *
 * @param queries 查询条件
 * @param page 页码
 * @param size 每页数目
 * @param orders 排序
 */
export default function QueryConditionBuild(queries: Array<BaseQuery>, page: number, size: number, orders: Array<BaseOrder>): any {
    let must = [] as Array<any>;
    let must_not = [] as Array<any>;
    let should = [] as Array<any>;
    for (let query of queries) {
        if (query.type === 'must') {
            buildQuery(query, must);
        } else if (query.type === 'must_not') {
            buildQuery(query, must_not);
        } else if (query.type === 'should') {
            buildQuery(query, should);
        }
    }
    let body = getBaseBody(page, size);
    body.query.bool.must = must;
    body.query.bool.must_not = must_not;
    body.query.bool.should = should;
    if (orders.length > 0) {
        buildOrder(orders, body);
    }
    return body;
}