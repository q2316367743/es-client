import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";

export default class BrowserLodisStrategyImpl implements LodisStrategy {

    get(key: string): string | null {
        return localStorage.getItem(key);
    }

    has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

}