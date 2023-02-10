import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";

export default class UtoolsWindowStrategyImpl implements WindowStrategy {

    close(): void {
    }

    max(): void {
    }

    min(): void {
        utools.outPlugin();
    }

}