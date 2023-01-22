import Dexie from 'dexie';
import Chart from '@/entity/Chart';
import MessageUtil from "@/utils/MessageUtil";


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
     * @param chart 链接
     * @param id ID
     */
    updateById(chart: Chart, id: number): Promise<number> {
        return this.chartResponse.put(chart);
    }

    async deleteById(id: number): Promise<void> {
        let chart = await this.chartResponse.get(id);
        if (!chart) {
            MessageUtil.error('删除失败，图表不存在')
            return new Promise<void>(resolve => {
                resolve()
            });
        }
        return this.chartResponse.delete(id);
    }

}