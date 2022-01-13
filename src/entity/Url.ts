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
    sequence?: number;

    /**
     * 创建时间
     */
    create_time?: number;

    /**
     * 更新时间
     */
    update_time?: Date;

    /**
     * 逻辑删除
     */
    is_deleted?: number;

}

export default Url;