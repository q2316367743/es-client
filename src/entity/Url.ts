interface Url {

    /**
     * ID
     */
    id?: number;

    /**
     * 链接名称
     */
    name?: string;

    /**
     * 链接值
     */
    value?: string;

    /**
     * 排序
     */
    sequence: number;

    /**
     * 创建时间
     */
    create_time?: Date;

    /**
     * 更新时间
     */
    update_time?: Date;

}

export default Url;