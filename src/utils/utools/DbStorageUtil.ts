import {toRaw} from "vue";

export function getItem<T>(key: string): T | null {
    let value = utools.dbStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        return null;
    }
    return value;

}

export function getItemByDefault<T>(key: string, defaultValue: T) {
    let value = utools.dbStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        return defaultValue;
    }
    return value;
}

export function setItem(key: string, value: any) {
    utools.dbStorage.setItem(key, toRaw(value));
}

export interface DbList<T> {

    list: Array<T>;

    rev?: string;

}

export interface DbRecord<T> {

    record: T;

    rev?: string;

}

// --------------------------------------- 列表操作 ---------------------------------------

export async function listByAsync<T>(key: string): Promise<DbList<T>> {
    const res = await utools.db.promises.get(key);
    if (res) {
        return {
            list: res.value,
            rev: res._rev
        };
    }
    return {list: []};
}

export async function saveListByAsync<T>(key: string, records: Array<T>, rev?: string): Promise<undefined | string> {
    const res = await utools.db.promises.put({
        _id: key,
        _rev: rev,
        value: toRaw(records)
    });
    if (res.error) {
        if (res.message === "Document update conflict") {
            // 查询后更新
            const res = await utools.db.promises.get(key);
            return await saveListByAsync(key, records, res ? res._rev : undefined);
        }
        return Promise.reject(res.message);
    }
    return Promise.resolve(res.rev);
}

// --------------------------------------- 单一对象操作 ---------------------------------------

export async function getFromOneByAsync<T extends Record<string, any>>(key: string, record: T): Promise<DbRecord<T>> {
    const res = await utools.db.promises.get(key);
    if (!res) {
        return {record}
    }
    return Promise.resolve({
        record: Object.assign(record, res.value),
        rev: res._rev
    });
}

export async function saveOneByAsync(key: string, value: Record<string, any>, rev?: string): Promise<undefined | string> {
    const res = await utools.db.promises.put({
        _id: key,
        _rev: rev,
        value: toRaw(value)
    });
    if (res.error) {
        return Promise.reject(res.message);
    }
    return Promise.resolve(res.rev);
}

export async function removeOneByAsync(key: string, ignoreError: boolean = false): Promise<void> {
    const res = await utools.db.promises.remove(key);
    if (res.error) {
        if (!ignoreError) {
            return Promise.reject(res.message);
        }
    }
}


// --------------------------------------- 批量操作 ---------------------------------------

/**
 * 批量删除指定key开头的文档
 * @param key ID前缀
 * @param ignoreError 是否忽略异常，默认不忽略
 */
export async function removeMultiByAsync(key: string, ignoreError: boolean = false): Promise<void> {
    const items = await utools.db.promises.allDocs(key);
    for (let item of items) {
        await removeOneByAsync(item._id, ignoreError);
    }
}


// --------------------------------------- 临时存储 ---------------------------------------

export function getStrBySession(key: string): string {
    return sessionStorage.getItem(key) || '';
}

export function setStrBySession(key: string, value: string) {
    sessionStorage.setItem(key, value);
}
