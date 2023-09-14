import TableNameEnum from "@/enumeration/TableNameEnum";
import {DexieInstance, dexieInstance} from "@/plugins/dexie";
import Base from "@/entity/Base";

/**
 * 基础Service
 */
export default class BaseService<T extends Base> {

    private readonly instance: DexieInstance;
    private readonly tableName: TableNameEnum;

    constructor(tableName: TableNameEnum) {
        this.instance = dexieInstance;
        this.tableName = tableName;
    }

    delete<T extends Base>(id: number): Promise<void> {
        return this.instance.table<T, number>(this.tableName).delete(id);
    }

    insert(record: Omit<T, 'id' | 'createTime' | 'updateTime'>): Promise<number> {
        const now = new Date();
        return this.instance.table<T, number>(this.tableName).add({
            ...record,
            id: now.getTime(),
            createTime: now,
            updateTime: now
        } as T);
    }

    list(condition?: Partial<T>): Promise<Array<T>> {
        if (condition) {
            let key = '';
            let value: any;
            for (let conditionKey in condition) {
                key = conditionKey;
                value = condition[conditionKey];
            }
            if (value) {
                return this.instance.table(this.tableName).where(key).equals(value).sortBy('id');
            }
        }
        return this.instance.table(this.tableName).toCollection().sortBy('id');
    }

    one(id: number): Promise<T | undefined> {
        return this.instance.table(this.tableName).get(id);
    }

    async update(id: number, record: Omit<T, 'id' | 'createTime' | 'updateTime'>): Promise<void> {
        // 查询旧的
        const old = await this.one(id);
        if (!old) {
            return Promise.reject(`数据【${id}】不存在`);
        }
        const now = new Date();

        await this.instance.table<T, number>(this.tableName)
            .put({
                ...record,
                createTime: old.createTime,
                updateTime: now,
                id: id
            } as T)

    }

    clear(): Promise<void> {
        return this.instance.table<T, number>(this.tableName).clear();
    }


}
