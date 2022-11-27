import Header from "@/view/Header";
import Index from "@/view/Index";

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

function initKey(headers: Array<Header>, headersSet: Set<string>): void {
    headersSet.add('_id');
    headers.push({
        field: '_id',
        id: new Date().getTime() + 1,
        minWidth: 90,
    });
    headersSet.add('_index');
    headers.push({
        field: '_index',
        id: new Date().getTime() + 1,
        minWidth: 120,
    });
    headersSet.add('_score');
    headers.push({
        field: '_score',
        id: new Date().getTime() + 1,
        minWidth: 120,
    });
}

function renderRecord(source: any, record: any, headers: Array<Header>, headersSet: Set<string>) {
    for (let key in source) {
        if (!headersSet.has(key)) {
            headers.push({
                field: key,
                id: new Date().getTime(),
                minWidth: Math.max(key.length * 20 + 15, 60)
            });
            headersSet.add(key);
        }
        if (typeof source[key] !== 'object') {
            record[key] = source[key];
        }
    }
}

export default function recordBuild(result: any, index: Index): { headers: Array<Header>, records: Array<any>, count: number } {
    console.log(result)
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
    // 初始化key
    initKey(headers, headersSet);
    // 遍历每一个结果
    let hits = result.hits.hits as Array<any>;
    for (let hit of hits) {
        let _id = hit['_id'];
        let _index = hit['_index'];
        let _score = hit['_score'];
        let _source = hit['_source'];
        let record = { _id, _index, _score };
        renderRecord(_source, record, headers, headersSet);
        records.push(record);

    }
    return {
        headers,
        records,
        count: result.hits.total
    };
}