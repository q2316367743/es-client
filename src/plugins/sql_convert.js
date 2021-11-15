function parse_field(value, result) {
    // 去除括号
    value = value.trim();
    let items = value.split(',');
    if (items.length === 0) {
        throw Error('字段不能为空');
    }
    let source = [];
    for (let item of items) {
        source.push(item.trim());
    }
    if (source.length > 1 || source[0] !== '*') {
        result.condition['_source'] = source;
    }
}
function parse_index(value, result) {
    result.index = value.trim();
}

function parse_condition(value, result) {
    value = value.trim();
    let cdt_and = value.split('and');
    for (let item of cdt_and) {
        let cdt = item.split('=');
        let condition = {};
        condition[cdt[0].trim()] = cdt[1].trim();
        result.condition.query.bool.must.push({
            term: condition
        })
    }
}

function parse_order(value, result) {
    value = value.trim();
    for (let item of value.split(',')) {
        item = item.trim();
        let temps = item.split(' ');
        let order = {};
        if (temps.length === 2) {
            order[temps[0]] = {
                order: temps[1].trim()
            }
        }else if (temps.length === 1) {
            order[temps[0]] = {
                order: 'asc'
            }
        }
        result.condition.sort.push(order);
    }
}

function parse_limit(value, result) {
    value = value.trim();
    let items = value.split(',');
    if (items.length === 2) {
        result.condition.from = parseInt(items[0]);
        result.condition.size = parseInt(items[1]);
    }else if (items.length === 1) {
        result.condition.size = parseInt(items[0]);
    }
}

/**
 * SQL转换器
 */
export function convert(sql) {
    // 全部转换为小写
    sql = sql.toLowerCase();
    sql = sql.replace("\n", " ");
    // 需要的一些方法
    let result = {
        index: '',
        condition: {
            query: {
                bool: {
                    must: [],
                    must_not: [],
                    should: []
                }
            },
            from: 0,
            size: 10,
            sort: [],
        }
    }
    let select = sql.indexOf('select ');
    let from = sql.indexOf('from ');
    let where = sql.indexOf('where ');
    let order = sql.indexOf('order by ');
    let limit = sql.indexOf('limit ');
    // 字段
    parse_field(sql.substring(select + 7, from), result);
    // 索引
    if (where === -1) {
        parse_index(sql.substring(from + 5), result)
    }else {
        parse_index(sql.substring(from + 5, where), result);
        if (order !== -1) {
            parse_condition(sql.substring(where + 6, order), result);
        }else if (limit !== -1) {
            parse_condition(sql.substring(where + 6, limit), result);
        }else {
            parse_condition(sql.substring(where + 6), result)
        }
    }
    if (order !== -1) {
        if (limit !== -1) {
            parse_order(sql.substring(order + 9, limit), result);
        }else {
            parse_order(sql.substring(order + 9), result);
        }
    }
    if (limit !== -1) {
        parse_limit(sql.substring(limit + 6), result);
    }
    return result;
}