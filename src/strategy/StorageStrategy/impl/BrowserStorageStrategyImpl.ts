import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import TableNameEnum from "@/enumeration/TableNameEnum";
import DexieInstance from "@/plugins/dexie";
import Base from "@/entity/Base";

export default class BrowserStorageStrategyImpl implements StorageStrategy {

    private readonly instance: DexieInstance;

    constructor() {
        this.instance = new DexieInstance();
    }

    delete<T extends Base>(name: TableNameEnum, id: number): Promise<void> {
        return this.instance.table<T, number>(name).delete(id);
    }

    insert<T extends Base>(name: TableNameEnum, record: T): Promise<number> {
        return this.instance.table<T, number>(name).add(record);
    }

    list<T extends Base>(name: TableNameEnum, condition?: Partial<T>): Promise<Array<T>> {
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

    one<T extends Base>(name: TableNameEnum, id: number): Promise<T | undefined> {
        return this.instance.table(name).get(id);
    }

    update<T extends Base>(name: TableNameEnum, id: number, record: T): Promise<void> {
        return new Promise<void>(resolve => {
            this.instance.table<T, number>(name)
                .put(record)
                .then(() => resolve());
        });
    }


}