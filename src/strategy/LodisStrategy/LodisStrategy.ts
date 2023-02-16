export default interface LodisStrategy {

    set(key: string, value: string): Promise<void>;

    get(key: string): Promise<string | null>;

    has(key: string): Promise<boolean>;

    remove(key: string): Promise<void>;

}