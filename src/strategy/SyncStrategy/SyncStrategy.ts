export default interface SyncStrategy {

    /**
     * 获取指定同步策略中全部的数据（远程数据）
     *
     * @param tableName 表名
     */
    list<T>(tableName:string): Promise<Array<T>>;

    /**
     * 同步一个岛远程
     *
     * @param tableName 表名
     * @param id ID
     * @param record 记录
     */
    update<T>(tableName: string, id: number, record: T): Promise<void>;

    /**
     * 新增一个远程
     *
     * @param tableName 表名
     * @param record 记录
     */
    insert<T>(tableName: string, record: T): Promise<void>;

}