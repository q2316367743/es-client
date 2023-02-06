export default class Optional<T> {

    private readonly value?: T;

    private constructor(value?: T) {
        this.value = value;
    }

    public static ofNullable<T>(value?: T): Optional<T> {
        return new Optional<T>(value);
    }

    public map<S>(mapper: (value: T) => S): Optional<S> {
        return new Optional<S>(this.value !== undefined ? mapper(this.value!) : undefined);
    }

    public peek(peek: (value: T) => T): Optional<T> {
        return new Optional<T>(this.value !== undefined ? peek(this.value) : undefined);
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

    public orElse(value: T): T {
        return this.value === undefined ? value : this.value;
    }

    public get(): T | undefined {
        return this.value;
    }

}