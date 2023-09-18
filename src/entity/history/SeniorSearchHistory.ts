import Base from "@/entity/Base";

export interface SeniorSearchHistoryIndex extends Base {

    /**
     * 名字。唯一
     */
    name: string;

}

/**
 * 历史记录
 * */
export interface SeniorSearchHistoryRecord {

    id: number;

    /**
     * 参数
     */
    body: string;

}


export function getDefaultSeniorSearchHistoryRecord(): SeniorSearchHistoryRecord {
    return {
        id: 0,
        body: '',
    }
}
