import TableNameEnum from "@/enumeration/TableNameEnum";
import {DexieInstance, dexieInstance} from "@/plugins/dexie";
import Base from "@/entity/Base";
import {clone} from "xe-utils";
import PageResult from "@/domain/PageResult";

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

    async page(current: number, size: number, condition?: Partial<T>): Promise<PageResult<T>> {
        if (condition) {
            let key = '';
            let value: any;
            for (let conditionKey in condition) {
                key = conditionKey;
                value = condition[conditionKey];
            }
            if (value) {

                const total = await this.instance.table(this.tableName).where(key).equals(value).count();
                const records = await this.instance.table<T>(this.tableName)
                    .where(key)
                    .equals(value)
                    .offset(Math.max((current - 1) * size, 0))
                    .limit(Math.max(size, 0))
                    .reverse()
                    .sortBy('id');
                return {
                    current,
                    size,
                    total,
                    records
                }
            }
        }
        const total = await this.instance.table(this.tableName).toCollection().count();
        const records = await this.instance.table<T>(this.tableName)
            .offset(Math.max((current - 1) * size, 0))
            .limit(Math.max(size, 0))
            .reverse()
            .sortBy('id');
        return {
            current,
            size,
            total,
            records
        };

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
                return this.instance.table(this.tableName).where(key).equals(value).reverse().sortBy('id');
            }
        }
        return this.instance.table(this.tableName).toCollection().reverse().sortBy('id');
    }

    delete<T extends Base>(id: number): Promise<void> {
        return this.instance.table<T, number>(this.tableName).delete(id);
    }

    insert(record: Omit<T, 'id' | 'createTime' | 'updateTime'>): Promise<number> {
        const now = new Date();
        return this.instance.table<T, number>(this.tableName).add({
            ...clone(record, true),
            id: now.getTime(),
            createTime: now,
            updateTime: now
        } as T);
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
                ...old,
                ...clone(record, true),
                createTime: old.createTime,
                updateTime: now,
                id: id
            } as T)

    }

    clear(): Promise<void> {
        return this.instance.table<T, number>(this.tableName).clear();
    }


}
