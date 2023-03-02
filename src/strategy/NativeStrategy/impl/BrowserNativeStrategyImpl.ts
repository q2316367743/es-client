import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import DownloadType from "../DownloadType";

export default class BrowserNativeStrategyImpl implements NativeStrategy {
    copy(value: string): void {
        BrowserUtil.copy(value);
    }
    download(value: string, name: string, type: DownloadType): void {
        BrowserUtil.download(value, name, type);
    }

    checkUpdate(): void {
        MessageUtil.warning('浏览器版本无需检测更新');
    }

    openLink(link: string): void {
        window.open(link);
    }

}