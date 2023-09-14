import {ClassName} from "@arco-design/web-vue/es/_utils/types";
import {DocumentSearchResult} from "@/components/es/domain/DocumentSearchResult";

const MAX_WIDTH = 600;

export function buildTableColumnData(dataIndex: string, width: number, title?: string, fixed: boolean = false): TableViewColumnData {
    return {
        title: title ? title : dataIndex,
        dataIndex,
        ellipsis: true,
        tooltip: width === MAX_WIDTH,
        width,
        cellClass: fixed ? 'table-view-cell table-view-fixed' : 'table-view-cell',
    }
}

export interface BuildConfig {

    /**
     * 是否包含公共
     */
    common: boolean;

    /**
     * 是否包含源
     */
    source: boolean;

    /**
     * 分隔符
     */
    separator: string;

}

export interface TableViewColumnData {
    dataIndex: string;
    title: string;
    width: number;
    fixed?: 'left' | 'right';
    ellipsis: boolean;
    tooltip?: boolean | Record<string, any>;
    sortable?: TableViewSortable;
    cellClass: ClassName;

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
 * @param result 数据
 * @constructor
 */
export function jsonToTable(result: DocumentSearchResult<any>): TableView {
    return jsonToTableComplete(result, {common: true, source: true, separator: "-"});
}

/**
 * JSON转化为表格视图
 * @param result 记录
 * @param config 配置
 * @constructor
 */
export function jsonToTableComplete(
    result: DocumentSearchResult<any>,
    config: BuildConfig,
): TableView {
    // 当变化时，进行渲染
    let records = new Array<any>();
    let columnMap = new Map<string, TableViewColumnData>();
    if (config.common) {
        // 只有全部才会加入基础对象
        columnMap.set('_id', {
            title: '_id',
            dataIndex: '_id',
            ellipsis: true,
            tooltip: true,
            width: 110,
            sortable: {
                sortDirections: ['ascend', 'descend']
            },
            cellClass: 'table-view-cell table-view-fixed'
        });
        ['_index', '_score'].forEach(key => columnMap.set(key, buildTableColumnData(key, 110)));
    }

    // 开始渲染
    for (let item of result.hits.hits) {
        let record = {} as Record<string, any>;
        if (config.common) {
            record['_id'] = item['_id'];
            record['_index'] = item['_index'];
            record['_score'] = item['_score'];
        }
        let _source = item['_source'];
        renderObj(_source, columnMap, record, '', config.separator);
        if (config.source) {
            record['_source'] = item;
        }
        records.push(record);
    }
    // 渲染结束，开始赋值
    let columns = Array.from(columnMap.values());
    let x = 0;
    columns.map(e => e.width).forEach(e => x += (e || 0));
    // 此处设置显示的列
    return {
        columns, records,
        total: typeof result.hits.total == "number" ? result.hits.total : result.hits.total.value
    }
}

export function renderObj(
    obj: Record<string, any>,
    columnMap: Map<string, TableViewColumnData>,
    record: Record<string, string>,
    prefix: string,
    separator: string
) {
    for (let key in obj) {
        // 基础值
        let source = obj[key];
        let dataIndex = prefix === '' ? key : `${prefix}${separator}${key}`;
        let title = prefix === '' ? key : `${prefix}.${key}`;
        let value = '';
        // 处理对象
        if (typeof source === 'object') {
            // JSON转字符串
            if (source instanceof Array) {
                value = JSON.stringify(source);
            } else {
                renderObj(source, columnMap, record, title, separator);
                continue;
            }
        } else {
            // 普通类型，直接渲染
            value = `${source}`;
        }
        // 计算宽度
        let width = widthCalc(value, title);
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

export function widthCalc(str: string, expand: string = ''): number {
    return Math.min(
        Math.max(str.length * 10 + 80,
            expand === '' ? 0 : expand.length * 10 + 80),
        MAX_WIDTH);
}
