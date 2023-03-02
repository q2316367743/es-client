import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import MessageUtil from "@/utils/MessageUtil";

export default class BrowserNativeStrategyImpl implements NativeStrategy {

    checkUpdate(): void {
        MessageUtil.warning('浏览器版本无需检测更新');
    }

    openLink(link: string): void {
        window.open(link);
    }

}