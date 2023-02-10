import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";

export default class BrowserNativeStrategyImpl implements NativeStrategy {

    openLink(link: string): void {
        window.open(link);
    }

}