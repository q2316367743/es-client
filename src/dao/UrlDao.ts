import Dexie from 'dexie';
import { ElMessage } from 'element-plus'
import Url from '@/entity/Url';

class UrlDao extends Dexie {
    public url: Dexie.Table<Url, number>;

    constructor() {
        super('mysql_database_design');
        this.version(1).stores({
            url: '++id, &name, &value, sequence, create_time, update_time, is_deleted' // Primary key and indexed props
        });
        this.url = this.table('url');
    }

    list(callback: (urls: Array<Url>) => void): void {
        this.url.where("is_deleted").equals(0).toArray().then(record => {
            callback(record);
        });
    }

    getById(id: number, callback: (urls: Url) => void): void {
        this.url.get(id).then((url?: Url) => {
            if (url) {
                callback(url);
            }else {
                ElMessage({
                    message: '链接不存在，请重试',
                    type: 'error',
                });
            }
        })
    }

    insert(url: Url, callback: () => void): void {
        this.url.put(url).then(() => callback());
    }

    updateById(url: Url, id: number, callback: () => void): void {
        url.id = id;
        this.url.put(url).then(() => callback());
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
            url.is_deleted = 1;
            this.url.put(url).then(() => callback());
        })
    }

}

const urlDao = new UrlDao();

export default urlDao;