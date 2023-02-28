/**
 * 导出类型
 */
export enum ExportType {

    /**
     * *.csv
     */
    CSV = 1,

    /**
     * *.html
     */
    HTML = 2,

    /**
     * *.xml
     */
    XML = 3,

    /**
     * tab分割
     * *.txt
     */
    TSV = 4,

    /**
     * *.json
     */
    JSON = 5,

    /**
     * *.yml
     */
    YML = 6

}

export enum ExportScope {

    /**
     * 当前页面
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
     * 导出的字段
     */
    fields: Array<string>;

    /**
     * 每次分页查询的数量
     */
    size: number;

}