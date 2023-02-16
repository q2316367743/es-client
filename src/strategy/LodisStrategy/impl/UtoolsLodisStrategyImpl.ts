import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";

export default class UtoolsLodisStrategyImpl implements LodisStrategy {

    get(key: string): Promise<string | null> {
        return Promise.resolve(utools.dbStorage.getItem(key));
    }

    has(key: string): Promise<boolean> {
        return Promise.resolve(utools.dbStorage.getItem(key) !== null);
    }

    remove(key: string): Promise<void> {
        utools.dbStorage.removeItem(key);
        return Promise.resolve();
    }

    set(key: string, value: string): Promise<void> {
        utools.dbStorage.setItem(key, value);
        return Promise.resolve();
    }


}