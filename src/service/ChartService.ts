import Dexie from 'dexie';
import { ElMessage } from 'element-plus'
import Chart from '@/entity/Chart';


export default class ChartService {

    private readonly chartResponse: Dexie.Table<Chart, number>;

    constructor(chartResponse: Dexie.Table<Chart, number>) {
        this.chartResponse = chartResponse;
    }

    list(): Promise<Array<Chart>> {
        return this.chartResponse.orderBy('sequence').toArray();
    }

    getById(id: number): Promise<Chart | undefined> {
        return this.chartResponse.get(id);
    }

    insert(chart: Chart): Promise<number> {
        return this.chartResponse.put(chart);
    }

    /**
     * 更新数据根据，
     * 
     * @param url 链接
     * @param id ID
     * @param callback 回调函数
     */
    updateById(chart: Chart, id: number): Promise<number> {
        return this.chartResponse.put(chart);
    }

    async deleteById(id: number): Promise<void> {
        let chart = await this.chartResponse.get(id);
        if (!chart) {
            ElMessage({
                message: '删除失败，不存在',
                type: 'error',
            });
            return new Promise<void>(resolve => {
                resolve()
            });
        }
        return this.chartResponse.delete(id);
    }

}