import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";
import {appWindow} from '@tauri-apps/api/window'
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default class TauriWindowStrategyImpl implements WindowStrategy {
    close(): void {
        appWindow.close().then(() => console.log('关闭成功'));
    }

    max(): void {
        appWindow.isMaximized().then(max => {
            if (max) {
                appWindow.unmaximize().then(() => console.log('恢复'));
            }else {
                appWindow.maximize().then(() => console.log('最大化'));
            }
        })
    }

    min(): void {
        appWindow.minimize().then(() => console.log('最小化'))
    }

    show(): { min: boolean; max: boolean; close: boolean } {
        return {close: true, max: true, min: true};
    }

}