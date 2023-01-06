export default class Optional<T> {

    private readonly value?: T;

    private constructor(value?: T) {
        this.value = value;
    }

    public static ofNullable<T>(value?: T): Optional<T> {
        return new Optional<T>(value);
    }

    public map<S>(mapper: (value: T) => S): Optional<S> {
        return new Optional<S>(this.value ? mapper(this.value) : undefined);
    }

    public orElse(value: T): T {
        return this.value || value;
    }

}