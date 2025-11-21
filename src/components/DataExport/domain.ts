import {DocumentSearchQuery} from "@/domain/es/DocumentSearchQuery";

/**
 * 导出类型
 */
export enum ExportType {

    // --------------------------------------- 树形数据 ---------------------------------------

    /**
     * *.json
     */
    JSON = '.json',


    // --------------------------------------- 结构化数据 ---------------------------------------

    /**
     * *.csv
     */
    CSV = '.csv',

    /**
     * tab分割
     * *.txt
     */
    TSV = '.tsv',

    /**
     * 指定分隔符
     */
    TXT = '.txt',

    /**
     * 表格
     */
    XLSX = '.xlsx'

}

export enum ExportScope {

    /**
     * 当前页面
     *
     * 高级查询这只能选择此选项
     */
    CURRENT = 1,

    /**
     * 全部数据
     */
    ALL = 2,

    /**
     * 指定范围
     */
    CUSTOM = 3

}

export enum ExportSource {

    /**
     * 全部数据
     */
    ALL = 1,

    /**
     * 只导出hits中数据
     */
    HIT = 2,

    /**
     * 只导出source数据
     */
    SOURCE = 3

}

export enum ExportMode {

    /**
     * 下载
     */
    DOWNLOAD = 1,

    /**
     * 拷贝到剪切板
     */
    COPY = 2

}

export enum ApiType {
    BASE = 1,
    SCROLL = 2
}

export interface ExportConfig {

    /**
     * 文件名
     */
    name: string;

    /**
     * 导出文件类型
     */
    type: ExportType;

    /**
     * 指定分隔符
     */
    separator: string;

    /**
     * 导出范围
     */
    scope: ExportScope;

    /**
     * 自定义开始
     */
    customStart: number;

    /**
     * 自定义截止
     */
    customEnd: number;

    /**
     * 导出源
     */
    source: ExportSource;

    /**
     * 导出的字段
     */
    fields: Array<string>;

    /**
     * 每次分页查询的数量
     */
    size: number;

    /**
     * 导出方式
     */
    mode: ExportMode;

    /**
     * 索引
     */
    index: string;

    /**
     * 查询条件
     */
    search: DocumentSearchQuery;

    /**
     * API类型
     */
    apiType: ApiType;

    /**
     * 滚动时间，API类型是scroll时有效
     */
    scrollTime: string;

}

export default interface ConditionExportEvent {

    /**
     * 使用的索引
     */
    name: string;

    /**
     * 使用的索引
     */
    index: string;

    /**
     * 查询条件
     */
    search: DocumentSearchQuery;

}
