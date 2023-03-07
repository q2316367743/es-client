import {ClassName} from "@arco-design/web-vue/es/_utils/types";
import IndexView from "@/view/index/IndexView";

const MAX_WIDTH = 600;

function buildTableColumnData(dataIndex: string, width: number, title?: string, fixed: boolean = false): TableViewColumnData {
    return {
        title: title ? title : dataIndex,
        dataIndex,
        ellipsis: true,
        tooltip: width === MAX_WIDTH,
        width,
        cellClass: fixed ? 'table-view-cell table-view-fixed' : 'table-view-cell',
        sortable: fixed ? {
            sortDirections: ["ascend", "descend"]
        } : undefined
    }
}

export interface TableViewColumnData {
    dataIndex?: string;
    title?: string;
    width?: number;
    fixed?: 'left' | 'right';
    ellipsis?: boolean;
    tooltip?: boolean | Record<string, any>;
    sortable?: TableViewSortable;
    cellClass?: ClassName;

}

export interface TableViewSortable {
    sortDirections: ('ascend' | 'descend')[];
}

/**
 * 表格视图数据
 */
export interface TableView {

    /**
     * 记录
     */
    records: Array<any>;

    /**
     * 列
     */
    columns: Array<TableViewColumnData>;

    /**
     * 总数
     */
    total: number;
}

/**
 * JSON转化为表格视图
 * @param data 数据
 * @param index 索引，如果有
 * @constructor
 */
export function JsonToTableBuild(data: any, index?: IndexView): TableView {
    // 当变化时，进行渲染
    let records = new Array<any>();
    let columnMap = new Map<string, TableViewColumnData>();
    // 基础对象
    columnMap.set('_id', {
        title: '_id',
        dataIndex: '_id',
        ellipsis: true,
        width: 110,
        sortable: {
            sortDirections: ['ascend', 'descend']
        },
        cellClass: 'table-view-cell table-view-fixed'
    });
    ['_index', '_score'].forEach(key => columnMap.set(key, buildTableColumnData(key, 110)));

    // 开始渲染
    for (let item of data.hits.hits) {
        let record = {} as Record<string, string>;
        record['_id'] = item['_id'];
        record['_index'] = item['_index'];
        record['_score'] = item['_score'];
        let _source = item['_source'];
        renderObj(_source, columnMap, record, '');
        record['_source'] = item;
        records.push(record);
    }
    // 渲染结束，开始赋值
    let columns = Array.from(columnMap.values());
    let x = 0;
    columns.map(e => e.width).forEach(e => x += (e || 0));
    // 此处设置显示的列
    return {
        columns, records,
        total: data.hits.total.value !== undefined ? data.hits.total.value : data.hits.total
    }
}

export function renderObj(
    obj: Record<string, any>,
    columnMap: Map<string, TableViewColumnData>,
    record: Record<string, string>,
    prefix: string
) {
    for (let key in obj) {
        // 基础值
        let source = obj[key];
        let dataIndex = prefix === '' ? key : `${prefix}-${key}`;
        let title = prefix === '' ? key : `${prefix}.${key}`;
        let width = 80;
        let value = '';
        // 处理对象
        if (typeof source === 'object') {
            // JSON转字符串
            if (source instanceof Array) {
                value = JSON.stringify(source);
            } else {
                renderObj(source, columnMap, record, title);
                break;
            }
        } else {
            // 普通类型，直接渲染
            value = `${source}`;
        }
        // 计算宽度
        width = Math.max(value.length * 10 + 80, title.length * 10 + 80);
        width = Math.min(width, MAX_WIDTH);
        // 列
        let column = buildTableColumnData(dataIndex, width, title, typeof source === 'number');

        // 判断列宽度
        if (columnMap.has(dataIndex)) {
            let temp = columnMap.get(dataIndex);
            if (temp && temp.width && temp.width < width) {
                // 宽度不合适，使用新的
                columnMap.set(dataIndex, column);
            }
        } else {
            // 不存在列，新增
            columnMap.set(dataIndex, column);
        }

        // 值
        record[dataIndex] = value;
    }
}