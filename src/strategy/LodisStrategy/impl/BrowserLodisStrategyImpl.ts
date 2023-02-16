import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";

export default class BrowserLodisStrategyImpl implements LodisStrategy {

    get(key: string): Promise<string | null> {
        return Promise.resolve(localStorage.getItem(key));
    }

    has(key: string): Promise<boolean> {
        return Promise.resolve(localStorage.getItem(key) !== null);
    }

    remove(key: string): Promise<void> {
        localStorage.removeItem(key);
        return Promise.resolve();
    }

    set(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
        return Promise.resolve();
    }

}