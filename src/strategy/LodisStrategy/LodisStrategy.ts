export default interface LodisStrategy {

    set(key: string, value: string): void;

    get(key: string): string | null;

    has(key: string): boolean;

    remove(key: string): void;

}