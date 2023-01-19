import SyncStrategy from "@/strategy/SyncStrategy/SyncStrategy";

export default class FileSyncStrategyImpl implements SyncStrategy {

    list<T>(tableName: string): Promise<Array<T>> {
        return Promise.resolve([]);
    }

    insert<T>(tableName: string, record: T): Promise<void> {
        return Promise.resolve(undefined);
    }

    update<T>(tableName: string, id: number, record: T): Promise<void> {
        return Promise.resolve(undefined);
    }


}