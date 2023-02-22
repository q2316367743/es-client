export default interface LodisStrategy {

    set<T>(key: string, value: T): Promise<void>;

    get<T>(key: string): Promise<T | null>;

    has(key: string): Promise<boolean>;

    remove(key: string): Promise<void>;

}