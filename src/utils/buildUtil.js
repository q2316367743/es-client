/**
 * 构建索引
 */
export function buildIndices(cluster_stats) {
    let indices = {};
    for (let index in cluster_stats.metadata.indices) {
        indices[index] = buildField(
            cluster_stats.metadata.indices[index].mappings
        );
    }
    return indices;
}

/**
 * 构建字段
 */
function buildField(mappings) {
    let fileds = {};
    fileds["match_all"] = "";
    fileds["_all"] = "";
    // 第一步，遍历类型
    for (let type in mappings) {
        // 遍历字段
        let properties = mappings[type].properties;
        for (let property in properties) {
            if (properties[property].properties) {
                // 是对象
                let objs = properties[property].properties;
                for (let obj in objs) {
                    fileds[`${type}.${property}.${obj}`] = objs[obj].type;
                }
            } else if (properties[property].fields) {
                // 存在keyword
                let temps = properties[property].fields;
                // 本身加入
                fileds[`${type}.${property}`] = properties[property].type;
                for (let temp in temps) {
                    fileds[`${type}.${property}.${temp}`] = temps[temp].type;
                }
            } else {
                fileds[`${type}.${property}`] = properties[property].type;
            }
        }
    }
    return fileds;
}

/**
 * 构建查询语句
 */
export function buildQuery(items) {
    let body = {
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
    for (let item of items) {
        let condition = {};
        let filed = {};
        // 去除第一个类型
        let temps = item.field.split(".");
        if (temps.length > 1) {
            // 普通
            filed[temps.slice(1, temps.length).join(".")] = item.value;
            condition[item.condition] = filed;
        } else {
            // match_all
            condition[item.field] = filed;
        }
        if (item.bool === "must") {
            body.query.bool.must.push(condition);
        } else if (item.bool === "must_not") {
            body.query.bool.must_not.push(condition);
        } else if (item.bool === "should") {
            body.query.bool.should.push(condition);
        }
    }
    return body;
}