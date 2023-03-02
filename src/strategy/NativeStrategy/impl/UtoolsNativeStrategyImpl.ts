import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import MessageUtil from "@/utils/MessageUtil";

export default class UtoolsNativeStrategyImpl implements NativeStrategy {

    checkUpdate(): void {
        MessageUtil.warning('Utools版本无需检测更新');
    }

    openLink(link: string): void {
        utools.shellOpenExternal(link);
    }

}