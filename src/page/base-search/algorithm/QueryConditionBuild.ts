import {BaseQuery} from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";
import MessageUtil from "@/utils/MessageUtil";
import {useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import {ConditionArray, DocumentSearchQuery, QuerySort} from "@/components/es/domain/DocumentSearchQuery";

/**
 * 获取基础查询请求体
 * @returns 基础查询请求体
 */
function getBaseBody(page: number, size: number): DocumentSearchQuery {
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
        sort: {},
        aggs: {},
    };
}

function buildQuery(query: BaseQuery, array: ConditionArray): void {
    // 启用
    if (!query.isEnable) {
        return;
    }
    // 字段是否为空
    if (!query.field || query.field === '') {
        if (query.condition !== 'exists' && query.condition !== 'missing') {
            return;
        }
    }
    let condition = {} as any;
    let expression: Record<string, any> = {};
    let cod: string = query.condition;
    // 不同的条件，查询方式和表达式不同
    if (query.condition === 'match' ||
        query.condition === 'term' ||
        query.condition === 'wildcard') {
        expression[query.field] = query.value;
    } else if (query.condition === 'terms') {
        expression[query.field] = JSON.parse(query.value);
    } else if (query.condition === 'exists') {
        expression["field"] = query.field;
    } else if (query.condition === 'missing') {
        expression["field"] = query.field;
        cod = 'exists';
    } else if (query.condition === 'range_lt') {
        let value = {} as any;
        value['lt'] = query.value;
        expression[query.field] = value;
        cod = 'range';
    } else if (query.condition === 'range_lte') {
        let value = {} as any;
        value['lte'] = query.value;
        expression[query.field] = value;
        cod = 'range';
    } else if (query.condition === 'range_gt') {
        let value = {} as any;
        value['gt'] = query.value;
        expression[query.field] = value;
        cod = 'range';
    } else if (query.condition === 'range_gte') {
        let value = {} as any;
        value['gte'] = query.value;
        expression[query.field] = value;
        cod = 'range';
    } else {
        throw new Error('查询条件不支持')
    }
    condition[cod] = expression;
    array.push(condition);
}

function buildOrder(orders: Array<BaseOrder>): QuerySort {
    const sort: QuerySort = {};
    for (let order of orders) {
        if (order.field === '' || order.type === null) {
            continue;
        }
        if (!order.isEnable) {
            continue;
        }
        sort[order.field] = {order: order.type};
    }
    return sort;
}

/**
 * 构造es查询条件
 *
 * @param queries 查询条件
 * @param page 页码
 * @param size 每页数目
 * @param orders 排序
 */
export default function QueryConditionBuild(
    queries: Array<BaseQuery>,
    page: number,
    size: number,
    orders: Array<BaseOrder>
): DocumentSearchQuery {
    let must: ConditionArray = [];
    let must_not: ConditionArray = [];
    let should: ConditionArray = [];
    let index = 0;
    for (let query of queries) {
        index += 1;
        try {
            if (query.condition === 'missing') {
                // 取反
                if (query.type === 'must') {
                    buildQuery(query, must_not);
                } else if (query.type === 'must_not') {
                    buildQuery(query, must);
                } else if (query.type === 'should') {
                    buildQuery(query, should);
                }
            } else {
                if (query.type === 'must') {
                    buildQuery(query, must);
                } else if (query.type === 'must_not') {
                    buildQuery(query, must_not);
                } else if (query.type === 'should') {
                    buildQuery(query, should);
                }
            }
        } catch (e) {
            MessageUtil.warning(`第${index}个条件解析错误`, e);
        }
    }
    let body = getBaseBody(page, size);
    body.query = {
        bool: {
            must,
            must_not,
            should
        }
    }
    if (orders.length > 0) {
        body.sort = buildOrder(orders);
    }
    let customerOption = {} as Record<string, any>;
    if (useBaseSearchSettingStore().enableTrackTotalHits) {
        customerOption['track_total_hits'] = useBaseSearchSettingStore().trackTotalHits
    }
    return {
        ...body,
        ...customerOption,
        ...useBaseSearchSettingStore().defaultParams
    };
}
