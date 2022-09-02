import Dexie from 'dexie';
import Tip from '@/entity/Tip';
import Url from '@/entity/Url';
import Chart from '@/entity/Chart';

class Instance extends Dexie {

    private readonly tip: Dexie.Table<Tip, number>;
    private readonly url: Dexie.Table<Url, number>;
    private readonly chart: Dexie.Table<Chart, number>;

    constructor() {
        super('es-client');
        this.version(4).stores({
            url: '++id, &name, &value, sequence, create_time, update_time',
            tip: '++id, method, link, mode, create_time, update_time',
            chart: '++id, create_time, update_time, &name, index_id, description, method, path, params, data, template'
        }).upgrade(trans => {
            console.log(trans)
        })
        this.tip = this.table('tip');
        this.url = this.table('url');
        this.chart = this.table('chart')
    }

    public getUrl(): Dexie.Table<Url, number> {
        return this.url;
    }

    public getTip(): Dexie.Table<Tip, number> {
        return this.tip;
    }

    public getChart(): Dexie.Table<Chart, number> {
        return this.chart;
    }

}

const instance = new Instance();

export default instance;