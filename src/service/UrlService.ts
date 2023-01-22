import Dexie from 'dexie';
import Url from '@/entity/Url';
import TableNameEnum from "@/enumeration/TableNameEnum";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import Assert from "@/utils/Assert";
import MessageUtil from "@/utils/MessageUtil";

export default class UrlService {

    private readonly url: Dexie.Table<Url, number>;
    private readonly instance: Dexie;

    constructor(instance: Dexie, url: Dexie.Table<Url, number>) {
        this.instance = instance;
        this.url = url;
    }

    async list(): Promise<Array<Url>> {
        return this.url.orderBy('sequence').toArray();
    }

    getById(id: number, callback: (urls: Url) => void): void {
        this.url.get(id).then((url?: Url) => {
            if (url) {
                callback(url);
            } else {
                MessageUtil.error('链接不存在，请重试');
            }
        })
    }

    insert(url: Url): Promise<number> {
        return this.url.put({
            name: url.name,
            value: url.value,
            sequence: url.sequence,
            createTime: new Date(),
            updateTime: new Date(),
            isAuth: url.isAuth,
            authUser: url.authUser,
            authPassword: url.authPassword
        });
    }

    /**
     * 更新数据根据，
     *
     * @param url 链接
     * @param id ID
     */
    updateById(url: Url, id: number): Promise<number> {
        return this.url.put({
            id: id,
            name: url.name,
            value: url.value,
            sequence: url.sequence,
            createTime: url.createTime,
            updateTime: new Date(),
            isAuth: url.isAuth,
            authUser: url.authUser,
            authPassword: url.authPassword
        });
    }

    deleteById(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.url.get(id).then((url?: Url) => {
                if (!url) {
                    reject('链接不存在');
                    return;
                }
                this.url.delete(id).then(resolve);
            })
        })
    }

    deleteAllById(id: number): Promise<void> {
        return this.instance.transaction("readwrite",
            [TableNameEnum.URL, TableNameEnum.BASE_SEARCH_HISTORY, TableNameEnum.SENIOR_SEARCH_HISTORY],
            async trans => {
                let urlDao = trans.table(TableNameEnum.URL) as Dexie.Table<Url>;
                let baseSearchHistoryDao = trans.table(TableNameEnum.BASE_SEARCH_HISTORY) as Dexie.Table<BaseSearchHistory>;
                let seniorSearchHistoryDao = trans.table(TableNameEnum.SENIOR_SEARCH_HISTORY) as Dexie.Table<SeniorSearchHistory>;
                let url = await urlDao.get(id);
                Assert.notNull(url, "链接不存在，请刷新后重试");
                // 删除链接
                urlDao.delete(id);
                // 查询基础搜索历史
                let baseSearchHistories = await baseSearchHistoryDao.where('urlId').equals(id).toArray();
                for (let baseSearchHistory of baseSearchHistories) {
                    await baseSearchHistoryDao.delete(baseSearchHistory.id);
                }
                // 查询高级搜索历史
                let seniorSearchHistories = await seniorSearchHistoryDao.where('urlId').equals(id).toArray();
                for (let seniorSearchHistory of seniorSearchHistories) {
                    await seniorSearchHistoryDao.delete(seniorSearchHistory.id);
                }
            });
    }

}