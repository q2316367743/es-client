import {TableColumnData, TableData} from "@arco-design/web-vue";
import {fetchEs} from "@/plugins/native/axios";


export interface Table {
    columns: Array<TableColumnData>;
    records: Array<TableData>;
    width: number;
}

/**
 * cat一个属性
 * @param url 链接
 */
export async function cat(url: string): Promise<Table> {
    const rsp = await fetchEs<string>({
        url,
        method: 'GET',
        responseType: "text"
    });

    const columns = new Array<TableColumnData>();
    const records = new Array<TableData>();
    let width = 0;

    // 第一排是标题
    let lines = rsp.split("\n");
    if (lines.length == 0) {
        return {columns, records, width};
    }
    const headerStr = lines[0];
    const headers = headerStr.split(" ").filter(e => e.trim() !== '');
    headers.forEach(header => {
        const column: TableColumnData = {title: header, dataIndex: header, width: Math.max(30, header.length * 16)};
        if (header === 'index') {
            // 索引增加排序
            column.sortable = {
                sortDirections: ['ascend', 'descend']
            }
        }
        columns.push(column);

    });
    if (lines.length == 1) {
        columns.map(e => e.width || 0).forEach(e => width += e);
        return {columns, records, width};
    }
    let recordsStr = lines.slice(1);
    for (let recordStr of recordsStr) {
        let recordItems = recordStr.split(" ").filter(e => e.trim() !== '');
        const record: TableData = {};
        for (let i = 0; i < recordItems.length; i++) {
            record[headers[i] || ''] = recordItems[i];
            columns[i].width = Math.max(columns[i].width || 30, recordItems[i].length * 13)
        }
        records.push(record);
    }
    // 重新计算宽度
    columns.map(e => e.width || 0).forEach(e => width += e);
    return {columns, records, width};
}

interface Url {
    title: string;
    key: string;
}

// =^.^=
// /_cat/allocation
// /_cat/shards
// /_cat/shards/{index}
// /_cat/master
// /_cat/nodes
// /_cat/tasks
// /_cat/indices
// /_cat/indices/{index}
// /_cat/segments
// /_cat/segments/{index}
// /_cat/count
// /_cat/count/{index}
// /_cat/recovery
// /_cat/recovery/{index}
// /_cat/health
// /_cat/pending_tasks
// /_cat/aliases
// /_cat/aliases/{alias}
// /_cat/thread_pool
// /_cat/thread_pool/{thread_pools}
// /_cat/plugins
// /_cat/fielddata
// /_cat/fielddata/{fields}
// /_cat/nodeattrs
// /_cat/repositories
// /_cat/snapshots/{repository}
// /_cat/templates

const urls = ['allocation', 'shards', 'shards/{index}', 'master', 'nodes', 'tasks', 'indices', 'indices/{index}',
    'segments', 'segments/{index}', 'count', 'count/{index}', 'recovery', 'recovery/{index}',
    'health', 'pending_tasks', 'aliases', 'thread_pool', 'plugins', 'fielddata', 'nodeattrs', 'repositories', 'templates'];

export const tabs: Array<Url> = urls.map(e => ({title: e, key: `/_cat/${e}?v`}));
