import Url from '@/entity/Url';
import TableNameEnum from "@/enumeration/TableNameEnum";
import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";

export default class UrlService {

    private readonly storageStrategy: StorageStrategy

    constructor(storageStrategy: StorageStrategy) {
        this.storageStrategy = storageStrategy;
    }

    async list(): Promise<Array<Url>> {
        return this.storageStrategy.list<Url>(TableNameEnum.URL);
    }

    insert(url: Url): Promise<number> {
        return this.storageStrategy.insert<Url>(TableNameEnum.URL, {
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
    updateById(id: number, url: Url): Promise<void> {
        return this.storageStrategy.update<Url>(TableNameEnum.URL, id, {
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
        return this.storageStrategy.delete<Url>(TableNameEnum.URL, id);
    }

    deleteAllById(id: number): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                // 删除指定URL
                await this.storageStrategy.delete(TableNameEnum.URL, id);
                // 查询全部基础查询历史
                let bshList = await this.storageStrategy.list<BaseSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, {urlId: id});
                for (let bsh of bshList) {
                    await this.storageStrategy.delete<BaseSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, bsh.id!);
                }
                // 查询全部高级查询历史
                let sshList = await this.storageStrategy.list<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, {urlId: id});
                for (let ssh of sshList) {
                    await this.storageStrategy.delete<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, ssh.id!);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

}