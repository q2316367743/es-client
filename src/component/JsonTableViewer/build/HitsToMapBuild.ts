import { List } from "lodash";

/**
 * hit转数组构造器
 */
export default function HitsToMapBuild(hits: Array<any>): Array<any> {
    let records = new Array<any>();
    for(let hit of hits) {
        buildHit(hit, records);
    }
    return records;
}

function buildHit(hit: any, records: Array<any>): void {

}

/**
 * 解析个字段
 * @param hit 记录
 * @param records 全部结果
 * @param prefix 前缀
 */
function buildField(field: any, records: Array<any>, prefix: string): void {

}