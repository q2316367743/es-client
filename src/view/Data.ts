export interface Repository {

    name: string;

    url: string;

}

export interface Log {

    version: string;

    time: string;

    items: Array<string | LogItem | Array<string>>

    title?: string;

    remark?: string | Array<Item>

}

export interface LogItem {

    label: LogItemEnum;

    content: string;

}

export enum LogItemEnum {

    /**
     * 新增
     */
    ADD = 1,

    /**
     * 优化
     */
    OPTIMIZATION = 2,

    /**
     * 修复
     */
    REPAIR = 3,

    /**
     * 更新/改版
     */
    UPDATE = 4

}

export interface Item {

    type: ItemType,

    value: string;

    addon?: string

}

export type ItemType = 'string' | 'link';