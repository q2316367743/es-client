import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";
import MessageUtil from "@/utils/MessageUtil";

export default class BrowserWindowStrategyImpl implements WindowStrategy {

    close(): void {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }

    max(): void {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.fullScreen();
        }
    }

    min(): void {
        MessageUtil.warning('浏览器模式下无法隐藏');
    }

    private isFullscreen() {
        const screen = window.screen
        const body = document.body.getBoundingClientRect()
        return screen.height === body.height && screen.width === body.width
    }

    private fullScreen() {
        document.documentElement.requestFullscreen().then(() => console.log('进入全屏'));
    }

    private exitFullscreen() {
        document.exitFullscreen().then(() => console.log('退出全屏'));
    }


}