
import useUrlStore from "@/store/UrlStore";
import Dexie from "dexie";

/**
 * utools更新到3.0
 */
export async function updateTo3ByUtools() {
    const items = await utools.db.promises.allDocs('url');
    for (let item of items) {
        await useUrlStore().add(item.value);
    }
}

class DexieInstance extends Dexie {

    constructor(tableName: string) {
        super(tableName);
        this.version(5).stores({
            url: '++id, &name, &value, sequence',
        })
    }

}

export async function updateTo3ByWeb() {
    const instance = new DexieInstance('es-client');
    const items = await instance.table('url').toArray();
    for (let item of items) {
        await useUrlStore().add(item.value);
    }
}
