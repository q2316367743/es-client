/**
 * 导出类型
 */
export enum ExportType {

    // --------------------------------------- 树形数据 ---------------------------------------

    /**
     * *.json
     */
    JSON = 1,

    /**
     * *.yml
     */
    YML = 2,

    /**
     * *.xml
     */
    XML = 3,

    // --------------------------------------- 结构化数据 ---------------------------------------

    /**
     * *.html
     */
    HTML = 4,

    /**
     * *.csv
     */
    CSV = 5,

    /**
     * tab分割
     * *.txt
     */
    TSV = 6,

    /**
     * 指定分隔符
     */
    TXT = 7

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

}