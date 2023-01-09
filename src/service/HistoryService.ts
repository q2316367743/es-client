import Dexie from "dexie";
import HistoryEntity from "@/entity/HistoryEntity";
import {stringContain} from "@/utils/SearchUtil";

export class HistoryService {

    private readonly historyDao: Dexie.Table<HistoryEntity, number>

    constructor(historyDao: Dexie.Table<HistoryEntity, number>) {
        this.historyDao = historyDao;
    }

    list(name: string, urlId?: number): Promise<Array<HistoryEntity>> {
        if (urlId) {
            return new Promise<Array<HistoryEntity>>(resolve => {
                this.historyDao.where({urlId}).toArray().then(list => {
                    if (!name || name === '') {
                        resolve(list.sort((a, b) => b.updateTime?.getTime()! - a.updateTime?.getTime()!));
                    } else {
                        resolve(list.filter(e => stringContain(e.name!, name))
                            .sort((a, b) => b.updateTime?.getTime()! - a.updateTime?.getTime()!));
                    }
                })
            });
        }
        return new Promise<Array<HistoryEntity>>(resolve => {
            this.historyDao.toArray().then(list => {
                if (!name || name === '') {
                    resolve(list
                        .sort((a, b) => b.updateTime?.getTime()! - a.updateTime?.getTime()!));
                } else {
                    resolve(list.filter(e => stringContain(e.name!, name))
                        .sort((a, b) => b.updateTime?.getTime()! - a.updateTime?.getTime()!));
                }
            })
        });
    }

    async existByName(name: string): Promise<boolean> {
        let count = await this.historyDao.where({name}).toArray();
        return Promise.resolve(count.length > 0);
    }

    async save(record: HistoryEntity): Promise<number> {
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

    update(record: HistoryEntity): Promise<number> {
        if (!record.id) {
            return Promise.reject('ID不存在，无法更新')
        }
        return this.historyDao.put({
            id: record.id,
            urlId: record.urlId,
            createTime: record.createTime,
            updateTime: new Date(),
            name: record.name,
            link: record.link,
            method: record.method,
            params: record.params
        });
    }

    removeById(id: number): Promise<void> {
        return this.historyDao.delete(id);
    }

}