import Dexie from 'dexie';
import { ElMessage } from 'element-plus'
import Tip from '@/entity/Tip';

export default class TipService {

    private readonly tips: Dexie.Table<Tip, number>;

    constructor(tips: Dexie.Table<Tip, number>) {
        this.tips = tips;
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