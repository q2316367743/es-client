import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import TableNameEnum from "@/enumeration/TableNameEnum";
import Base from "@/entity/Base";
import Url from "@/entity/Url";
import ArrayUtil from "@/utils/ArrayUtil";
import {useUrlSelectEvent} from "@/global/BeanFactory";

interface Record<T> {

    /**
     * ID规则：表名-id
     */
    _id: string;

    _rev?: string;

    value: T;

}


export default class UtoolsStorageStrategyImpl implements StorageStrategy {

    constructor() {
        this.init().then(() => console.log('utools初始化成功'));
    }

    private async init() {
        // 获取全部feature
        let features = utools.getFeatures();
        let featureMap = ArrayUtil.map(features, 'code');
        // 获取全部链接
        let urls = await this.list<Url>(TableNameEnum.URL);
        let urlSet = new Set<string>();
        urls.forEach(url => urlSet.add(url.id + ''));
        // 初始化数据
        let deleteCodeList = new Array<string>();
        let addList = new Array<Url>();
        // 新增新的feature
        for (let url of urls) {
            let code = url.id + '';
            let feature = featureMap.get(code);
            if (feature) {
                // 存在，判断
                if (feature.code[0] !== url.name) {
                    deleteCodeList.push(code);
                    addList.push(url);
                }
            } else {
                // 新增
                addList.push(url);
            }
        }
        for (let feature of features) {
            if (!urlSet.has(feature.code)) {
                deleteCodeList.push(feature.code);
            }
        }
        deleteCodeList.forEach(code => utools.removeFeature(code));
        addList.forEach(url => {
            if (url.name) {
                utools.setFeature({
                    code: url.id + '',
                    explain: 'elasticsearch链接',
                    cmds: [url.name],
                    platform: ['darwin', 'win32', 'linux']
                });
            }
        });
        // 未完全退出事件
        utools.onPluginEnter(action => {
            if (action.code !== 'application') {
                useUrlSelectEvent.emit(parseInt(action.code));
            }else {
                useUrlSelectEvent.emit(0);
            }
        });
    }

    async delete<T extends Base>(name: TableNameEnum, id: number): Promise<void> {
        // 删除
        if (name === TableNameEnum.URL) {
            utools.removeFeature(id + '');
        }
        let dbReturn = await utools.db.promises.remove(`${name}-${id}`);
        if (dbReturn.ok) {
            return Promise.resolve();
        }
        return Promise.reject(dbReturn.message)
    }

    async insert<T extends Base>(name: TableNameEnum, record: T): Promise<number> {
        record.id = new Date().getTime();
        let dbReturn = await utools.db.promises.put({
            _id: `${name}-${record.id}`,
            value: record
        });
        if (dbReturn.ok) {
            // 新增成功
            if (name === TableNameEnum.URL) {
                let url = record as Url;
                if (url.name) {
                    utools.setFeature({
                        code: record.id + '',
                        explain: 'elasticsearch链接',
                        cmds: [url.name],
                        platform: ['darwin', 'win32', 'linux']
                    });
                }
            }
            return Promise.resolve(record.id);
        }
        return Promise.reject(dbReturn.message);
    }

    async list<T extends Base>(name: TableNameEnum, condition?: Partial<T>): Promise<Array<T>> {
        let dbDocs = await utools.db.promises.allDocs(name);
        let records = new Array<T>();
        for (let dbDoc of dbDocs) {
            if (condition) {
                let next = false;
                for (let conditionKey in condition) {
                    if (dbDoc.value[conditionKey] !== condition[conditionKey]) {
                        next = true
                    }
                }
                if (next) {
                    continue;
                }
            }
            // 新增
            records.push(dbDoc.value);
        }
        return Promise.resolve(records);
    }

    async one<T extends Base>(name: TableNameEnum, id: number): Promise<T | undefined> {
        let dbDoc = await utools.db.promises.get(`${name}-${id}`) as Record<T>;
        return Promise.resolve(dbDoc ? dbDoc.value : undefined);
    }

    async update<T extends Base>(name: TableNameEnum, id: number, record: T): Promise<void> {
        // 获取数据
        let _rev = undefined as string | undefined;
        const old = await utools.db.promises.get(`${name}-${id}`);
        if (old) {
            _rev = old._rev;
        }
        let dbReturn = await utools.db.promises.put({
            _id: `${name}-${id}`,
            _rev,
            value: record
        });
        if (dbReturn.ok) {
            // 新增成功
            if (name === TableNameEnum.URL) {
                let url = record as Url;
                // 删除旧的
                utools.removeFeature(id + '');
                if (url.name) {
                    // 新增新的
                    utools.setFeature({
                        code: record.id + '',
                        explain: 'elasticsearch链接',
                        cmds: [url.name],
                        platform: ['darwin', 'win32', 'linux']
                    });
                }
            }
            return Promise.resolve();
        }
        return Promise.reject(dbReturn.message);
    }

}
