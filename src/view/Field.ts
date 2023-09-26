export default interface Field {

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
