import Dexie from 'dexie';
import { ElMessage } from 'element-plus'
import Tip from '@/entity/Tip';

class TipDao extends Dexie {

    public tips: Dexie.Table<Tip, number>;

    constructor() {
        super('es-client');
        this.version(1).stores({
            url: '++id, method, link, mode, create_time, update_time'
        })
        this.tips = this.table('tip');
    }

    list(): Promise<Array<Tip>> {
        return this.tips.toArray()
    }

    insert(tip: Tip, callback: () => void): void {
        this.tips.put({
            method: tip.method,
            link: tip.link,
            mode: tip.mode,
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
    updateById(tip: Tip, id: number, callback: () => void): void {
        this.tips.put({
            id: id,
            method: tip.method,
            link: tip.link,
            mode: tip.mode,
            update_time: new Date()
        }).then(callback);
    }

    deleteById(id: number, callback: () => void): void {
        this.tips.get(id).then((tip?: Tip) => {
            if (!tip) {
                ElMessage({
                    message: '删除失败，提示不存在',
                    type: 'error',
                });
                return;
            }
            this.tips.delete(id).then(callback);
        })
    }

}

const tipDao = new TipDao();

export default tipDao;