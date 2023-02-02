import TableNameEnum from "@/enumeration/TableNameEnum";

export default interface StorageStrategy {

    /**
     * 根据ID查询一个
     *
     * @param name 表名
     * @param id ID
     */
    one<T>(name: TableNameEnum, id: number): Promise<T | undefined>;

    /**
     * 列表查询
     *
     * @param name 表名
     * @param condition 条件
     */
    list<T>(name: TableNameEnum, condition?: Partial<T>): Promise<Array<T>>;

    /**
     * 新增记录
     *
     * @param name 表名
     * @param record 记录
     */
    insert<T>(name: TableNameEnum, record: T): Promise<number>;

    /**
     * 根据ID修改记录
     *
     * @param name 表名
     * @param id ID
     * @param record 记录
     */
    update<T>(name: TableNameEnum, id: number, record: T): Promise<void>;

    /**
     * 根据ID删除记录
     *
     * @param name 表名
     * @param id ID
     */
    delete<T>(name: TableNameEnum, id: number): Promise<void>;

}