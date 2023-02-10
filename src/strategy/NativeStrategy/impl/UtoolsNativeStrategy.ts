import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";

export default class UtoolsNativeStrategy implements NativeStrategy{

    openLink(link: string): void {
        utools.shellOpenExternal(link);
    }

}