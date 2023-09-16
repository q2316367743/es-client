import {SeniorSearchRecord} from "@/entity/record/SeniorSearchRecord";
import TableNameEnum from "@/enumeration/TableNameEnum";
import BaseService from "@/service/BaseService";
import PageResult from "@/domain/PageResult";

export class SeniorSearchRecordService {

    private readonly baseService: BaseService<SeniorSearchRecord>;

    constructor() {
        this.baseService = new BaseService<SeniorSearchRecord>(TableNameEnum.SENIOR_SEARCH_RECORD);
    }

    async page(current: number, size: number, urlId?: number): Promise<PageResult<SeniorSearchRecord>> {
        return this.baseService.page(current, size, {urlId});
    }

    async list(urlId?: number): Promise<Array<SeniorSearchRecord>> {
        return this.baseService.list({urlId});
    }

    async save(record: Omit<SeniorSearchRecord, 'id' | 'createTime' | 'updateTime'>): Promise<number> {
        return this.baseService.insert({
            urlId: record.urlId,
            method: record.method,
            link: record.link,
            body: record.body
        });
    }

    async update(record: Omit<SeniorSearchRecord, 'updateTime'>): Promise<void> {
        return this.baseService.update(record.id, record);
    }

    removeById(id: number): Promise<void> {
        return this.baseService.delete(id);
    }

    clear(): Promise<void> {
        return this.baseService.clear();
    }

}
