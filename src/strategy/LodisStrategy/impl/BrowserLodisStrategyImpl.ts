import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";

export default class BrowserLodisStrategyImpl implements LodisStrategy {

    get<T>(key: string): Promise<T | null> {
        let value = localStorage.getItem(key);
        if (!value) {
            return Promise.resolve(null);
        }
        if (/^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/.test(value)) {
            return Promise.resolve(JSON.parse(value));
        }
        return Promise.resolve(value as any);
    }

    has(key: string): Promise<boolean> {
        return Promise.resolve(localStorage.getItem(key) !== null);
    }

    remove(key: string): Promise<void> {
        localStorage.removeItem(key);
        return Promise.resolve();
    }

    set<T>(key: string, value: T): Promise<void> {
        if (typeof value === "string") {
            // 字符串
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
        return Promise.resolve();
    }

}