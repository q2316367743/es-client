import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";

export default class UtoolsNativeStrategyImpl implements NativeStrategy{

    openLink(link: string): void {
        utools.shellOpenExternal(link);
    }

}