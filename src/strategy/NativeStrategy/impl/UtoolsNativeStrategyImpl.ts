import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import DownloadType from "../DownloadType";

export default class UtoolsNativeStrategyImpl implements NativeStrategy {

    copy(value: string): void {
        utools.copyText(value);
    }
    
    download(value: string, name: string, type: DownloadType): void {
        BrowserUtil.download(value, name, type);
    }

    checkUpdate(): void {
        MessageUtil.warning('Utools版本无需检测更新');
    }

    openLink(link: string): void {
        utools.shellOpenExternal(link);
    }

}