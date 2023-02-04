import TableNameEnum from "@/enumeration/TableNameEnum";
import Base from "@/entity/Base";

export default interface StorageStrategy {

    /**
     * 根据ID查询一个
     *
     * @param name 表名
     * @param id ID
     */
    one<T extends Base>(name: TableNameEnum, id: number): Promise<T | undefined>;

    /**
     * 列表查询
     *
     * @param name 表名
     * @param condition 条件
     */
    list<T extends Base>(name: TableNameEnum, condition?: Partial<T>): Promise<Array<T>>;

    /**
     * 新增记录
     *
     * @param name 表名
     * @param record 记录
     */
    insert<T extends Base>(name: TableNameEnum, record: T): Promise<number>;

    /**
     * 根据ID修改记录
     *
     * @param name 表名
     * @param id ID
     * @param record 记录
     */
    update<T extends Base>(name: TableNameEnum, id: number, record: T): Promise<void>;

    /**
     * 根据ID删除记录
     *
     * @param name 表名
     * @param id ID
     */
    delete<T extends Base>(name: TableNameEnum, id: number): Promise<void>;

}