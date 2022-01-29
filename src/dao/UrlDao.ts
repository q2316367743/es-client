import Dexie, { Transaction } from 'dexie';
import { ElMessage } from 'element-plus'
import Url from '@/entity/Url';

class UrlDao extends Dexie {
    public url: Dexie.Table<Url, number>;

    constructor() {
        super('es-client');
        this.version(2).stores({
            url: '++id, &name, &value, sequence, create_time, update_time'
        }).upgrade((trans: Transaction) => {
            // 版本升级，结构改变。不会，暂时不处理
        });
        this.url = this.table('url');
    }

    list(callback: (urls: Array<Url>) => void): void {
        this.url.orderBy('sequence').toArray().then(record => {
            callback(record.sort((a, b) => a.sequence - b.sequence));
        });
    }

    getById(id: number, callback: (urls: Url) => void): void {
        this.url.get(id).then((url?: Url) => {
            if (url) {
                callback(url);
            } else {
                ElMessage({
                    message: '链接不存在，请重试',
                    type: 'error',
                });
            }
        })
    }

    insert(url: Url, callback: () => void): void {
        this.url.put({
            name: url.name,
            value: url.value,
            sequence: url.sequence,
            create_time: new Date(),
            update_time: new Date()
        }).then(callback);
    }

    /**
     * 更新数据根据，
     * 
     * @param url 链接
     * @param id ID
     * @param callback 回调函数
     */
    updateById(url: Url, id: number, callback: () => void): void {
        this.url.put({
            id: id,
            name: url.name,
            value: url.value,
            sequence: url.sequence,
            update_time: new Date()
        }).then(callback);
    }

    deleteById(id: number, callback: () => void): void {
        this.url.get(id).then((url?: Url) => {
            if (!url) {
                ElMessage({
                    message: '删除失败，链接不存在',
                    type: 'error',
                });
                return;
            }
            this.url.delete(id).then(callback);
        })
    }

}

const urlDao = new UrlDao();

export default urlDao;