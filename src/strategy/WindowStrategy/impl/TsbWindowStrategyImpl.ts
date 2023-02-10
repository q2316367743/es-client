import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";
import MessageUtil from "@/utils/MessageUtil";

export default class TsbWindowStrategyImpl implements WindowStrategy {

    close(): void {
        // @ts-ignore
        window.tsbApi.window.close();
    }

    max(): void {
        MessageUtil.warning('想天浏览器暂不支持最大化');
    }

    min(): void {
        // @ts-ignore
        window.tsbApi.window.hide();
    }

    show(): { min: boolean; max: boolean; close: boolean } {
        return {close: true, max: true, min: true};
    }

}