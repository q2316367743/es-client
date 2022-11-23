export interface Repository {

    name: string;

    url: string;

}

export interface Log {

    version: string;

    time: string;

    items: Array<string | Array<string>>

    title?: string;

    remark?: string | Array<Item>

}

export interface Item {

    type: ItemType,

    value: string;

    addon?: string

}

export type ItemType = 'string' | 'link'