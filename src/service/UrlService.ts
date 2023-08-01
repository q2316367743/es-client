import Url from '@/entity/Url';
import TableNameEnum from "@/enumeration/TableNameEnum";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import { storageStrategyContext } from "@/global/BeanFactory";
import Assert from '@/utils/Assert';
import useUrlStore from '@/store/UrlStore';

export default class UrlService {


    async list(): Promise<Array<Url>> {
        return storageStrategyContext.getStrategy().list<Url>(TableNameEnum.URL);
    }

    insert(url: Url): Promise<number> {
        return storageStrategyContext.getStrategy().insert<Url>(TableNameEnum.URL, {
            name: url.name,
            value: url.value,
            sequence: url.sequence,
            createTime: new Date(),
            updateTime: new Date(),
            isAuth: url.isAuth,
            authType: url.authType,
            authUser: url.authUser,
            authPassword: url.authPassword,
            version: url.version
        });
    }

    /**
     * 更新数据根据，
     *
     * @param url 链接
     * @param id ID
     */
    updateById(id: number, url: Url): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            storageStrategyContext.getStrategy().update<Url>(TableNameEnum.URL, id, {
                id: id,
                name: url.name,
                value: url.value,
                sequence: url.sequence,
                createTime: url.createTime,
                updateTime: new Date(),
                isAuth: url.isAuth,
                authType: url.authType,
                authUser: url.authUser,
                authPassword: url.authPassword,
                version: url.version
            }).then(() => {
                resolve();
                useUrlStore().reset();
            })
                .catch(reject)
        });
    }

    async updateVersionById(id: number, version: string): Promise<void> {
        // 查询url
        let url = await storageStrategyContext.getStrategy().one(TableNameEnum.URL, id) as Url;
        Assert.notNull(url, "url不存在");
        url.version = version;
        return this.updateById(id, url);
    }

    deleteById(id: number): Promise<void> {
        return storageStrategyContext.getStrategy().delete<Url>(TableNameEnum.URL, id);
    }

    deleteAllById(id: number): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                // 删除指定URL
                await storageStrategyContext.getStrategy().delete(TableNameEnum.URL, id);
                // 查询全部基础查询历史
                let bshList = await storageStrategyContext.getStrategy().list<BaseSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, { urlId: id });
                for (let bsh of bshList) {
                    await storageStrategyContext.getStrategy().delete<BaseSearchHistory>(TableNameEnum.BASE_SEARCH_HISTORY, bsh.id!);
                }
                // 查询全部高级查询历史
                let sshList = await storageStrategyContext.getStrategy().list<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, { urlId: id });
                for (let ssh of sshList) {
                    await storageStrategyContext.getStrategy().delete<SeniorSearchHistory>(TableNameEnum.SENIOR_SEARCH_HISTORY, ssh.id!);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

}
