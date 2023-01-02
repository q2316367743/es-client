import Header from "@/view/Header";
import Index from "@/view/index";

function verify(result: any, index: Index): boolean {
    if (!index) {
        return false
    }
    if (!result) {
        return false;
    }
    if (!result.hits) {
        return false;
    }
    return result.hits.hits;
}

function renderKey(prefix: string, key: string): string {
    return prefix === '' ? key : prefix + '.' + key
}

function renderRecord(source: any, record: any, headers: Array<Header>, headersSet: Set<string>, prefix: string = '') {
    for (let key in source) {
        if (!headersSet.has(renderKey(prefix, key))) {
            headers.push({
                field: renderKey(prefix, key),
                id: new Date().getTime() + Math.random() * 100,
                minWidth: Math.max(renderKey(prefix, key).length * 20 + 15, 60)
            });
            headersSet.add(renderKey(prefix, key));
        }
        if (typeof source[key] !== 'object') {
            record[renderKey(prefix, key)] = source[key];
        } else {
            if (Array.isArray(source[key])) {
                // 数组，直接显示
                record[renderKey(prefix, key)] = JSON.stringify(source[key]);
            } else {
                // 对象，下一层
                renderRecord(
                    source[key],
                    record,
                    headers,
                    headersSet,
                    renderKey(prefix, key));
            }
        }
    }
}

export default function recordBuild(result: any, index: Index): { headers: Array<Header>, records: Array<any>, count: number } {
    let headers = new Array<Header>();
    let headersSet = new Set<string>();
    let records = new Array<any>();
    if (!verify(result, index)) {
        return {
            headers,
            records,
            count: 0
        };
    }
    // 遍历每一个结果
    let hits = result.hits.hits as Array<any>;
    for (let hit of hits) {
        let _id = hit['_id'];
        let _index = hit['_index'];
        let _score = hit['_score'];
        let _source = hit['_source'];
        let record = { _id, _index, _score, _source };
        renderRecord(_source, record, headers, headersSet);
        records.push(record);

    }
    return {
        headers,
        records,
        count: result.hits.total.value ? result.hits.total.value : result.hits.total
    };
}