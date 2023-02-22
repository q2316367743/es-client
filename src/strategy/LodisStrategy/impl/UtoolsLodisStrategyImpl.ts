import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";


export default class UtoolsLodisStrategyImpl implements LodisStrategy {

    get<T>(key: string): Promise<T | null> {
        let value = utools.dbStorage.getItem(key);
        if (!value) {
            return Promise.resolve(null);
        }
        if (/^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/.test(value)) {
            return Promise.resolve(JSON.parse(value));
        }
        return Promise.resolve(value);
    }

    has(key: string): Promise<boolean> {
        return Promise.resolve(utools.dbStorage.getItem(key) !== null);
    }

    remove(key: string): Promise<void> {
        utools.dbStorage.removeItem(key);
        return Promise.resolve();
    }

    set<T>(key: string, value: T): Promise<void> {
        if (typeof value === "string") {
            // 字符串
            utools.dbStorage.setItem(key, value);
        } else {
            utools.dbStorage.setItem(key, JSON.stringify(value));
        }
        return Promise.resolve();
    }


}