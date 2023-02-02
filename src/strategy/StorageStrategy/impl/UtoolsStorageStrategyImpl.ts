import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import TableNameEnum from "@/enumeration/TableNameEnum";

export default class UtoolsStorageStrategyImpl implements StorageStrategy {

    delete<T>(name: TableNameEnum, id: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    insert<T>(name: TableNameEnum, record: T): Promise<number> {
        return Promise.resolve(0);
    }

    list<T>(name: TableNameEnum, condition?: Partial<T>): Promise<Array<T>> {
        return Promise.resolve([]);
    }

    one<T>(name: TableNameEnum, id: number): Promise<T | undefined> {
        return Promise.resolve(undefined);
    }

    update<T>(name: TableNameEnum, id: number, record: T): Promise<void> {
        return Promise.resolve(undefined);
    }

}