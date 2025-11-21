import {ConditionKey, SortConditionType} from "@/domain/es/DocumentSearchQuery";

/**
 * 条件项
 */
export interface ConditionItem {

    /**
     * 字段名
     */
    field: string;

    /**
     * 值
     */
    value: string;

    /**
     * 类型
     */
    type: ConditionKey;

    /**
     * 拓展
     */
    expand?: ConditionItemExpand;

}

export interface SortItem {
    field: string;
    type: SortConditionType
}

export type ConditionItemExpand = 'lt' | 'lte' | 'gt' | 'gte';

