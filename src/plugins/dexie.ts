import Dexie from 'dexie';

export class DexieInstance extends Dexie {

    constructor() {
        super('rain-es-client');
        this.version(1).stores({
            baseSearchRecord: '++id, urlId',
            seniorSearchRecord: '++id, urlId'
        })
    }

}

export const dexieInstance = new DexieInstance();
