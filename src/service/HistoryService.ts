import Dexie from "dexie";
import HistoryEntity from "@/entity/HistoryEntity";
import useUrlStore from "@/store/UrlStore";
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
                    if (!name || name === ''){
                        resolve(list);
                    }else {
                        resolve(list.filter(e => stringContain(e.name!, name)));
                    }
                })
            });
        }
        return new Promise<Array<HistoryEntity>>(resolve => {
            this.historyDao.toArray().then(list => {
                if (!name || name === ''){
                    resolve(list);
                }else {
                    resolve(list.filter(e => stringContain(e.name!, name)));
                }
            })
        });
    }

    save(record: HistoryEntity): Promise<number> {
        let urlId = useUrlStore().id;
        if (!urlId) {
            return Promise.reject('请选择链接');
        }
        return this.historyDao.add({
            id: undefined,
            urlId,
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

}