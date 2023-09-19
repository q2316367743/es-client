import {DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";

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
