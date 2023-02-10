import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";
import MessageUtil from "@/utils/MessageUtil";
import BrowserUtil from "@/utils/BrowserUtil";

export default class BrowserWindowStrategyImpl implements WindowStrategy {

    close(): void {
        MessageUtil.warning('浏览器模式下不支持关闭');
    }

    max(): void {
        if (BrowserUtil.isFullscreen()) {
            BrowserUtil.exitFullscreen();
        } else {
            BrowserUtil.fullScreen();
        }
    }

    min(): void {
        MessageUtil.warning('浏览器模式下无法隐藏');
    }

    show(): { min: boolean; max: boolean; close: boolean } {
        return {close: false, max: true, min: false};
    }


}