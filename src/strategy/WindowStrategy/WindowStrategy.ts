import WindowShow from "@/strategy/WindowStrategy/WindowShow";

export default interface WindowStrategy {

    min(): void;

    max(): void;

    close(): void;

}