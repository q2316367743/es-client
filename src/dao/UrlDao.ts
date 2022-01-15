import Dexie from 'dexie';
import { ElMessage } from 'element-plus'
import Url from '@/entity/Url';

class UrlDao extends Dexie {
    public url: Dexie.Table<Url, number>;

    constructor() {
        super('es-client');
        this.version(1).stores({
            url: '++id, &name, &value, sequence, create_time, update_time'
        });
        this.url = this.table('url');
    }

    list(callback: (urls: Array<Url>) => void): void {
        this.url.orderBy('sequence').toArray().then(record => {
            callback(record);
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
        url.id = id;
        url.update_time = new Date();
        this.url.put({
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