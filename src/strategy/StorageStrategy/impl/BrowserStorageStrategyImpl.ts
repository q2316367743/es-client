import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import TableNameEnum from "@/enumeration/TableNameEnum";
import DexieInstance from "@/plugins/dexie";

export default class BrowserStorageStrategyImpl implements StorageStrategy {

    private readonly instance: DexieInstance;

    constructor() {
        this.instance = new DexieInstance();
    }

    delete<T>(name: TableNameEnum, id: number): Promise<void> {
        return this.instance.table<T, number>(name).delete(id);
    }

    insert<T>(name: TableNameEnum, record: T): Promise<number> {
        return this.instance.table<T, number>(name).add(record);
    }

    list<T>(name: TableNameEnum, condition?: Partial<T>): Promise<Array<T>> {
        if (condition) {
            let key = '';
            let value: any;
            for (let conditionKey in condition) {
                key = conditionKey;
                value = condition[conditionKey];
            }
            if (value) {
                return this.instance.table(name).where(key).equals(value).toArray();
            }
        }
        return this.instance.table(name).toArray();
    }

    one<T>(name: TableNameEnum, id: number): Promise<T | undefined> {
        return this.instance.table(name).get(id);
    }

    update<T>(name: TableNameEnum, id: number, record: T): Promise<void> {
        return new Promise<void>(resolve => {
            this.instance.table<T, number>(name)
                .put(record)
                .then(() => resolve)
        });
    }


}