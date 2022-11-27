export default interface Header {

    /**
     * ID
     */
    id: number;

    /**
     * 字段名称
     */
    field: string;

    /**
     * 最小宽度
     */
    minWidth: number;

    /**
     * 提示信息
     */
    help?: {
        content: string
    }

}