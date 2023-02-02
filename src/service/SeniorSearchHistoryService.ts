import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import TableNameEnum from "@/enumeration/TableNameEnum";

export class SeniorSearchHistoryService {

    private readonly storageStrategy: StorageStrategy

    constructor(storageStrategy: StorageStrategy) {
        this.storageStrategy = storageStrategy;
    }

    async list(urlId?: number): Promise<Array<SeniorSearchHistory>> {
        return this.storageStrategy.list<SeniorSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, {urlId});
    }

    async existByName(name: string): Promise<boolean> {
        let count = await this.storageStrategy.list<SeniorSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, {name});
        return Promise.resolve(count.length > 0);
    }

    async save(record: SeniorSearchHistory): Promise<number> {
        if (!record.name || record.name === '') {
            return Promise.reject('记录名称不能为空');
        }
        if (await this.existByName(record.name)) {
            return Promise.reject('记录名称已存在');
        }
        return this.storageStrategy.insert<SeniorSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, {
            id: undefined,
            urlId: record.urlId,
            createTime: new Date(),
            updateTime: new Date(),
            name: record.name,
            link: record.link,
            method: record.method,
            params: record.params
        });
    }

    async update(record: SeniorSearchHistory): Promise<void> {
        if (!record.id) {
            return Promise.reject('ID不存在，无法更新');
        }
        let history = await this.storageStrategy.one<SeniorSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, record.id);
        if (!history) {
            return Promise.reject('未找到该历史，请选择新增到历史');
        }
        let item = Object.assign(history, record);
        item.updateTime = new Date();
        return this.storageStrategy.update<SeniorSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, record.id, item);
    }

    removeById(id: number): Promise<void> {
        return this.storageStrategy.delete<SeniorSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, id);
    }

}