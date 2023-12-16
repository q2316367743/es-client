import {ConditionKey, SortConditionType} from "@/components/es/domain/DocumentSearchQuery";

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
     * 操作符
     */
    type: ConditionKey;
}

export interface SortItem {
    field: string;
    type: SortConditionType
}

