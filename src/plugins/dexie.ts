import Dexie from 'dexie';

export class DexieInstance extends Dexie {

  constructor(tableName: string) {
    super(tableName);
    this.version(1).stores({
      baseSearchRecord: '++id, urlId',
      seniorSearchRecord: '++id, urlId'
    })
  }

}

export const dexieInstance = new DexieInstance('rain-es-client');
