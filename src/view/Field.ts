export default interface Field {

    /**
     * 显示名称
     */
    label: string;

    /**
     * 字段名称
     */
    name: string;

    /**
     * 数据索引，仅用于确保唯一
     */
    dataIndex: string;

    /**
     * 字段类型
     */
    type: string;

}
