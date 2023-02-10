export default interface WindowStrategy {

    min(): void;

    max(): void;

    close(): void;

    show(): {
        min: boolean;

        max: boolean;

        close: boolean;

    };

}