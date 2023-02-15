export default class Optional<T> {

    private readonly value?: T;

    private constructor(value?: T) {
        this.value = value;
    }

    public static ofNullable<T>(value?: T): Optional<T> {
        return new Optional<T>(value);
    }

    public map<S>(mapper: (value: T) => S): Optional<S> {
        if (this.value !== undefined && this.value !== null) {
            return new Optional<S>(mapper(this.value));
        } else {

            return new Optional<S>(undefined);
        }
    }

    public peek(peek: (value: T) => T): Optional<T> {
        if (this.value !== undefined && this.value !== null) {
            return new Optional<T>(peek(this.value));
        } else {

            return new Optional<T>(undefined);
        }
    }

    /**
     * 如果值未undefined时回调
     * @param callback 回调函数
     */
    public orCallback(callback: () => void): Optional<T> {
        if (typeof this.value === 'undefined') {
            callback();
        }
        return this;
    }

    public orElse<S extends T>(value: S): S {
        if (this.value === undefined || this.value === null) {
            return value;
        }
        return this.value as S;
    }

    public get(): T | undefined {
        return this.value;
    }

}