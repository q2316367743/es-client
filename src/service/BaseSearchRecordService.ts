import {BaseSearchRecord} from "@/entity/record/BaseSearchRecord";
import TableNameEnum from "@/enumeration/TableNameEnum";
import BaseService from "@/service/BaseService";

export class BaseSearchRecordService {

    private readonly baseService: BaseService<BaseSearchRecord>;

    constructor() {
        this.baseService = new BaseService<BaseSearchRecord>(TableNameEnum.BASE_SEARCH_RECORD);
    }

    async list(urlId?: number): Promise<Array<BaseSearchRecord>> {
        return this.baseService.list({urlId});
    }

    async save(record: Omit<BaseSearchRecord, 'id' | 'createTime' | 'updateTime'>): Promise<number> {
        return this.baseService.insert({
            urlId: record.urlId,
            index: record.index,
            conditions: record.conditions,
            orders: record.orders
        });
    }

    async update(record: Omit<BaseSearchRecord, 'createTime' | 'updateTime'>): Promise<void> {
        if (!record.id) {
            return Promise.reject('ID不存在，无法更新');
        }
        let history = await this.baseService.one(record.id);
        if (!history) {
            return Promise.reject('未找到该历史，请选择新增到历史');
        }
        let item = Object.assign(history, record);
        item.updateTime = new Date();
        return this.baseService.update(record.id, item);
    }

    removeById(id: number): Promise<void> {
        return this.baseService.delete(id);
    }

    clear(): Promise<void> {
        return this.baseService.clear();
    }

}
