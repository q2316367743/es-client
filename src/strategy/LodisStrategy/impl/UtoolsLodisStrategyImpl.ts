import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";

export default class UtoolsLodisStrategyImpl implements LodisStrategy {

    get(key: string): string | null {
        return utools.dbStorage.getItem(key);
    }

    has(key: string): boolean {
        return utools.dbStorage.getItem(key) !== null;
    }

    remove(key: string): void {
        utools.dbStorage.removeItem(key);
    }

    set(key: string, value: string): void {
        utools.dbStorage.setItem(key, value);
    }



}