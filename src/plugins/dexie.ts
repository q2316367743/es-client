import Dexie from 'dexie';
import Tip from '@/entity/Tip';
import Url from '@/entity/Url';

class Instance extends Dexie {

    private tip: Dexie.Table<Tip, number>;
    private url: Dexie.Table<Url, number>;

    constructor() {
        super('es-client');
        this.version(2).stores({
            url: '++id, &name, &value, sequence, create_time, update_time',
            tip: '++id, method, link, mode, create_time, update_time'
        })
        this.tip = this.table('tip');
        this.url = this.table('url');
    }

    public getUrl(): Dexie.Table<Url, number> {
        return this.url;
    }

    public getTip(): Dexie.Table<Tip, number> {
        return this.tip;
    }

}

const instance = new Instance();

export default instance;