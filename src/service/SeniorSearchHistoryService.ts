import Dexie from "dexie";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import {stringContain} from "@/utils/SearchUtil";
import Optional from "@/utils/Optional";

export class SeniorSearchHistoryService {

    private readonly historyDao: Dexie.Table<SeniorSearchHistory, number>

    constructor(historyDao: Dexie.Table<SeniorSearchHistory, number>) {
        this.historyDao = historyDao;
    }

    async list(name: string, urlId?: number): Promise<Array<SeniorSearchHistory>> {
        let array: SeniorSearchHistory[];
        if (urlId) {
            array = await this.historyDao.where({urlId}).toArray();
        } else {
            array = await this.historyDao.toArray();
        }
        if (name && name !== '') {
            array = array.filter(e => stringContain(e.name!, name));
        }
        // 排序
        array = array.sort((a, b) =>
            Optional.ofNullable(b.id).orElse(0) - Optional.ofNullable(a.id).orElse(0))
        return Promise.resolve(array);
    }

    async existByName(name: string): Promise<boolean> {
        let count = await this.historyDao.where({name}).toArray();
        return Promise.resolve(count.length > 0);
    }

    async save(record: SeniorSearchHistory): Promise<number> {
        if (!record.name || record.name === '') {
            return Promise.reject('记录名称不能为空');
        }
        if (await this.existByName(record.name)) {
            return Promise.reject('记录名称已存在');
        }
        return this.historyDao.add({
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

    async update(record: SeniorSearchHistory): Promise<number> {
        if (!record.id) {
            return Promise.reject('ID不存在，无法更新');
        }
        let history = await this.historyDao.get(record.id);
        if (!history) {
            return Promise.reject('未找到该历史，请选择新增到历史');
        }
        let item = Object.assign(history, record);
        item.updateTime = new Date();
        return this.historyDao.put(item);
    }

    removeById(id: number): Promise<void> {
        return this.historyDao.delete(id);
    }

}